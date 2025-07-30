import { supabase } from '../config/supabase';
import { claude } from '../config/claude';
import { Product, SupabaseProduct, ParsedProduct, UserStats } from '../types/shared.types';
import { logger } from '../utils/logger';

export class ProductsService {
  async getUserProducts(userId: string): Promise<Product[]> {
    try {
      // Obtener el user_id real desde whatsapp_users si existe vinculación
      const { data: whatsappUser } = await supabase
        .from('whatsapp_users')
        .select('user_id')
        .eq('id', userId)
        .single();
      
      if (!whatsappUser?.user_id) {
        // Usuario aún no vinculado con cuenta web, devolver array vacío
        return [];
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', whatsappUser.user_id)
        .order('expiry_date', { ascending: true });
      
      if (error) {
        logger.error('Error getting user products:', error);
        return [];
      }
      
      return this.transformSupabaseProducts(data || []);
    } catch (error) {
      logger.error('Error in getUserProducts:', error);
      return [];
    }
  }
  
  async addProductByText(userId: string, naturalText: string): Promise<Product | null> {
    try {
      // Parse texto natural usando IA
      const parsed = await this.parseProductText(naturalText);
      
      if (!parsed.name) {
        logger.warn('Could not parse product name from text:', naturalText);
        return null;
      }
      
      // Obtener el user_id real
      const { data: whatsappUser } = await supabase
        .from('whatsapp_users')
        .select('user_id')
        .eq('id', userId)
        .single();
      
      if (!whatsappUser?.user_id) {
        logger.warn('WhatsApp user not linked to web account');
        return null;
      }
      
      const productData = {
        name: parsed.name,
        category: this.guessCategory(parsed.name),
        quantity: parsed.quantity || '1',
        expiry_date: parsed.expiryDate || this.estimateExpiryDate(parsed.name),
        price: parsed.price || this.estimatePrice(parsed.name),
        source: 'whatsapp_text',
        user_id: whatsappUser.user_id
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        logger.error('Error adding product:', error);
        return null;
      }
      
      logger.info('Product added successfully:', { name: parsed.name, userId });
      return this.transformSupabaseProduct(data);
    } catch (error) {
      logger.error('Error in addProductByText:', error);
      return null;
    }
  }
  
  async getUrgentProducts(userId: string): Promise<Product[]> {
    const products = await this.getUserProducts(userId);
    return products.filter(p => p.daysLeft <= 2);
  }
  
  async getUserStats(userId: string): Promise<UserStats> {
    const products = await this.getUserProducts(userId);
    const urgent = products.filter(p => p.daysLeft <= 2);
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    
    const categories = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Sin categoría';
    
    const averageDaysLeft = products.length > 0 
      ? Math.round(products.reduce((sum, p) => sum + p.daysLeft, 0) / products.length)
      : 0;
    
    return {
      totalProducts: products.length,
      urgentProducts: urgent.length,
      totalValue,
      topCategory,
      averageDaysLeft
    };
  }
  
  private async parseProductText(text: string): Promise<ParsedProduct> {
    try {
      const prompt = `
Extrae información de producto de este texto en español:
"${text}"

Responde SOLO en JSON válido:
{
  "name": "nombre_producto",
  "quantity": "1 unidad/kg/litros/etc",
  "expiryDate": "YYYY-MM-DD" o null,
  "price": número o null
}

Productos comunes: leche, pan, yogur, jamón, huevos, tomates, queso, etc.
Si mencionan "mañana", "viernes", etc, calcula la fecha exacta.
Si no hay fecha, devuelve null.
Hoy es ${new Date().toISOString().split('T')[0]}.
`;
      
      const response = await claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }]
      });
      
      const responseText = response.content[0]?.text || '{}';
      return JSON.parse(responseText);
    } catch (error) {
      logger.error('Error parsing product text with AI:', error);
      return { name: null, quantity: null, expiryDate: null, price: null };
    }
  }
  
  private transformSupabaseProducts(supabaseProducts: SupabaseProduct[]): Product[] {
    return supabaseProducts.map(product => this.transformSupabaseProduct(product));
  }
  
  private transformSupabaseProduct(supabaseProduct: SupabaseProduct): Product {
    const expiryDate = new Date(supabaseProduct.expiry_date);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      id: parseInt(supabaseProduct.id),
      name: supabaseProduct.name,
      category: supabaseProduct.category,
      quantity: supabaseProduct.quantity.toString(),
      expiryDate: supabaseProduct.expiry_date,
      daysLeft,
      price: supabaseProduct.price,
      source: supabaseProduct.source,
      created_at: supabaseProduct.created_at,
      updated_at: supabaseProduct.updated_at
    };
  }
  
  private guessCategory(productName: string): string {
    const name = productName.toLowerCase();
    
    if (name.includes('leche') || name.includes('yogur') || name.includes('queso')) {
      return 'Lácteos';
    }
    if (name.includes('pan') || name.includes('cereales') || name.includes('pasta')) {
      return 'Cereales';
    }
    if (name.includes('tomate') || name.includes('lechuga') || name.includes('verdura')) {
      return 'Verduras';
    }
    if (name.includes('manzana') || name.includes('naranja') || name.includes('fruta')) {
      return 'Frutas';
    }
    if (name.includes('pollo') || name.includes('jamón') || name.includes('carne')) {
      return 'Carnes';
    }
    if (name.includes('huevo')) {
      return 'Huevos';
    }
    
    return 'Otros';
  }
  
  private estimateExpiryDate(productName: string): string {
    const name = productName.toLowerCase();
    const today = new Date();
    let daysToAdd = 7; // Por defecto 1 semana
    
    if (name.includes('leche')) daysToAdd = 5;
    else if (name.includes('pan')) daysToAdd = 3;
    else if (name.includes('yogur')) daysToAdd = 10;
    else if (name.includes('verdura') || name.includes('fruta')) daysToAdd = 4;
    else if (name.includes('carne') || name.includes('pollo')) daysToAdd = 2;
    else if (name.includes('huevo')) daysToAdd = 14;
    
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + daysToAdd);
    
    return expiryDate.toISOString().split('T')[0];
  }
  
  private estimatePrice(productName: string): number {
    const name = productName.toLowerCase();
    
    if (name.includes('leche')) return 1.20;
    if (name.includes('pan')) return 1.50;
    if (name.includes('yogur')) return 2.30;
    if (name.includes('queso')) return 4.50;
    if (name.includes('jamón')) return 3.20;
    if (name.includes('huevo')) return 2.80;
    if (name.includes('tomate')) return 2.50;
    if (name.includes('manzana')) return 2.00;
    if (name.includes('pollo')) return 5.50;
    if (name.includes('carne')) return 8.00;
    
    return 2.50; // Precio por defecto
  }
}
