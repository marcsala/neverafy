// Servicio para integrar Claude IA en Neverafy
// Funcionalidades: OCR de productos, generación de recetas

interface OCRResult {
  success: boolean;
  message: string;
  products?: Array<{
    name: string;
    expiryDate: string;
    confidence: number;
    category: string;
    estimatedPrice: string;
    detectedText: string;
  }>;
  receiptData?: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    date: string;
    store: string;
  };
}

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  urgentIngredients: string[];
  cookingTime: string;
  servings: number;
}

export class ClaudeAIService {
  private static readonly API_URL = 'https://api.anthropic.com/v1/messages';
  private static readonly MODEL = 'claude-sonnet-4-20250514';
  private static readonly MAX_TOKENS = 2000;
  private static readonly API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

  /**
   * Convierte imagen a base64
   */
  private static async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Llamada base a Claude API - usando servidor Express local
   */
  private static async callClaude(messages: any[]): Promise<any> {
    try {
      // Usar el servidor Express local en el puerto 3001
      const response = await fetch('http://localhost:3001/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL,
          max_tokens: this.MAX_TOKENS,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }

  /**
   * OCR para fechas de caducidad de productos individuales
   */
  static async processExpiryDateImage(imageFile: File): Promise<OCRResult> {
    try {
      const base64Data = await this.imageToBase64(imageFile);
      const mediaType = `image/${imageFile.type.split('/')[1]}`;

      const messages = [{
        role: 'user' as const,
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data
            }
          },
          {
            type: 'text',
            text: `Analiza esta imagen de un producto alimentario y extrae la información relevante.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni formato markdown.

Busca específicamente:
- Nombre del producto
- Fecha de caducidad o consumo preferente (convierte al formato YYYY-MM-DD)
- Categoría del producto (lácteos, carne, verduras, frutas, etc.)
- Precio si es visible
- El texto exacto donde aparece la fecha

Formato de respuesta JSON:
{
  "success": true,
  "message": "Producto detectado correctamente",
  "products": [
    {
      "name": "Nombre del producto",
      "expiryDate": "YYYY-MM-DD",
      "confidence": 0.95,
      "category": "categoría",
      "estimatedPrice": "2.50",
      "detectedText": "texto exacto donde aparece la fecha"
    }
  ]
}

Si no encuentras información clara, responde:
{
  "success": false,
  "message": "No se pudo detectar información del producto",
  "products": []
}`
          }
        ]
      }];

      const response = await this.callClaude(messages);
      const responseText = response.content[0].text.trim();
      
      // Limpiar posible markdown
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error processing expiry date image:', error);
      return {
        success: false,
        message: 'Error al procesar la imagen. Inténtalo de nuevo.',
        products: []
      };
    }
  }

  /**
   * OCR para tickets de compra completos
   */
  static async processReceiptImage(imageFile: File): Promise<OCRResult> {
    try {
      const base64Data = await this.imageToBase64(imageFile);
      const mediaType = `image/${imageFile.type.split('/')[1]}`;

      const messages = [{
        role: 'user' as const,
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data
            }
          },
          {
            type: 'text',
            text: `Analiza este ticket de compra y extrae todos los productos alimentarios.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni formato markdown.

Extrae:
- Lista de productos con sus precios
- Total de la compra
- Fecha de compra (formato YYYY-MM-DD)
- Nombre de la tienda/supermercado
- Solo productos alimentarios (ignora productos de limpieza, etc.)

Formato de respuesta JSON:
{
  "success": true,
  "message": "Ticket procesado correctamente",
  "receiptData": {
    "items": [
      {
        "name": "Leche Entera",
        "price": 1.20,
        "quantity": 1
      }
    ],
    "total": 8.90,
    "date": "2025-07-28",
    "store": "Mercadona"
  }
}

Si no se puede leer el ticket:
{
  "success": false,
  "message": "No se pudo leer el ticket correctamente",
  "receiptData": null
}`
          }
        ]
      }];

      const response = await this.callClaude(messages);
      const responseText = response.content[0].text.trim();
      
      // Limpiar posible markdown
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error processing receipt image:', error);
      return {
        success: false,
        message: 'Error al procesar el ticket. Inténtalo de nuevo.',
        receiptData: null
      };
    }
  }

  /**
   * Generación de recetas con productos urgentes
   */
  static async generateUrgentRecipes(products: any[]): Promise<Recipe[]> {
    try {
      // Filtrar productos urgentes (que caducan en 3 días o menos)
      const today = new Date();
      const urgentProducts = products.filter(product => {
        const expiryDate = new Date(product.expiryDate);
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 3;
      });

      if (urgentProducts.length === 0) {
        return [];
      }

      const messages = [{
        role: 'user' as const,
        content: `Genera 3 recetas creativas y prácticas usando estos productos que caducan pronto:

${urgentProducts.map(p => `- ${p.name} (caduca en ${this.calculateDaysLeft(p.expiryDate)} días)`).join('\n')}

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni formato markdown.

Requisitos:
- Priorizar los productos que caducan antes
- Recetas españolas/mediterráneas
- Tiempo de preparación máximo 45 minutos
- Incluir ingredientes básicos comunes (aceite, sal, ajo, cebolla, etc.)
- Instrucciones claras y detalladas
- Marcar qué ingredientes son urgentes

Formato JSON:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "description": "Descripción breve de la receta",
      "ingredients": ["producto1", "producto2", "aceite de oliva"],
      "instructions": ["Paso 1 detallado", "Paso 2 detallado"],
      "prepTime": "25 minutos",
      "difficulty": "Fácil",
      "urgentIngredients": ["productos que caducan pronto"],
      "cookingTime": "25 min",
      "servings": 2
    }
  ]
}`
      }];

      const response = await this.callClaude(messages);
      const responseText = response.content[0].text.trim();
      
      // Limpiar posible markdown
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanedResponse);
      
      return result.recipes || [];
    } catch (error) {
      console.error('Error generating urgent recipes:', error);
      throw new Error('Error al generar recetas urgentes');
    }
  }

  /**
   * Generación de recetas variadas con todos los productos
   */
  static async generateVariedRecipes(products: any[]): Promise<Recipe[]> {
    try {
      if (products.length === 0) {
        return [];
      }

      const messages = [{
        role: 'user' as const,
        content: `Genera 4 recetas variadas usando estos productos de mi nevera:

${products.map(p => `- ${p.name} (${this.calculateDaysLeft(p.expiryDate)} días restantes)`).join('\n')}

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni formato markdown.

Requisitos:
- Variedad de estilos: desayuno, almuerzo, cena, merienda
- Diferentes niveles de dificultad
- Usar diferentes combinaciones de productos
- Recetas españolas/mediterráneas
- Incluir ingredientes básicos comunes
- Instrucciones detalladas paso a paso

Formato JSON:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "description": "Descripción breve",
      "ingredients": ["producto1", "producto2"],
      "instructions": ["Paso 1", "Paso 2"],
      "prepTime": "20 minutos",
      "difficulty": "Medio",
      "urgentIngredients": [],
      "cookingTime": "20 min",
      "servings": 2
    }
  ]
}`
      }];

      const response = await this.callClaude(messages);
      const responseText = response.content[0].text.trim();
      
      // Limpiar posible markdown
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanedResponse);
      
      return result.recipes || [];
    } catch (error) {
      console.error('Error generating varied recipes:', error);
      throw new Error('Error al generar recetas variadas');
    }
  }

  /**
   * Calcular días restantes hasta caducidad
   */
  private static calculateDaysLeft(expiryDate: string): number {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export default ClaudeAIService;
