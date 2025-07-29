// =================================
// Dashboard Utilities
// =================================

import type { Product, ExpiryBadge, SupabaseProduct, DashboardStats } from '../types';

/**
 * Convierte un producto de Supabase al formato local
 */
export const convertSupabaseProduct = (supabaseProduct: SupabaseProduct): Product => {
  const today = new Date();
  const expiryDate = new Date(supabaseProduct.expiry_date);
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    id: parseInt(supabaseProduct.id) || Date.now(),
    name: supabaseProduct.name,
    quantity: supabaseProduct.quantity?.toString() || '1 unidad',
    expiryDate: supabaseProduct.expiry_date,
    daysLeft,
    price: supabaseProduct.price // 🆕 Incluir precio
  };
};

/**
 * Determina el badge de caducidad según los días restantes
 */
export const getExpiryBadge = (daysLeft: number): ExpiryBadge => {
  if (daysLeft < 1) return { class: 'urgent', text: 'Hoy' };
  if (daysLeft === 1) return { class: 'urgent', text: 'Mañana' };
  if (daysLeft < 4) return { class: 'warning', text: 'Pronto' };
  return { class: 'safe', text: 'Fresco' };
};

/**
 * Filtra productos urgentes (caducan en menos de 2 días)
 */
export const getUrgentProducts = (products: Product[]) => {
  return products.filter(p => p.daysLeft < 2);
};

/**
 * Cuenta productos que caducan pronto (menos de 4 días)
 */
export const getExpiringSoonCount = (products: Product[]) => {
  return products.filter(p => p.daysLeft < 4).length;
};

/**
 * 🆕 Calcula el valor total del inventario
 */
export const calculateTotalValue = (products: Product[]): number => {
  return products.reduce((total, product) => {
    return total + (product.price || 0);
  }, 0);
};

/**
 * 🆕 Calcula el valor de productos urgentes (potencial desperdicio)
 */
export const calculateUrgentValue = (products: Product[]): number => {
  const urgentProducts = getUrgentProducts(products);
  return urgentProducts.reduce((total, product) => {
    return total + (product.price || 0);
  }, 0);
};

/**
 * 🆕 Formatea precio a string con moneda
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price);
};

/**
 * 🆕 Calcula el ahorro estimado basado en productos consumidos vs desperdiciados
 */
export const calculateSavings = (products: Product[], consumedProductIds: number[] = []): {
  saved: number;
  wasted: number;
  total: number;
  percentage: number;
} => {
  const saved = products
    .filter(p => consumedProductIds.includes(p.id))
    .reduce((total, p) => total + (p.price || 0), 0);
    
  const wasted = products
    .filter(p => p.daysLeft < 0 && !consumedProductIds.includes(p.id))
    .reduce((total, p) => total + (p.price || 0), 0);
    
  const total = saved + wasted;
  const percentage = total > 0 ? (saved / total) * 100 : 0;
  
  return { saved, wasted, total, percentage };
};

/**
 * Calcula las estadísticas del dashboard (actualizada con precios)
 */
export const calculateDashboardStats = (products: Product[]): DashboardStats => {
  const totalValue = calculateTotalValue(products);
  const urgentValue = calculateUrgentValue(products);
  
  // TODO: Estos valores deberían venir de datos reales de consumo
  const mockSavings = Math.min(totalValue * 0.3, 47); // 30% del valor total o 47€ máximo
  
  return {
    totalProducts: products.length,
    expiringSoon: getExpiringSoonCount(products),
    savedMoney: formatPrice(mockSavings),
    co2Saved: '2.3kg', // TODO: Calcular basado en productos
    totalValue,
    potentialWaste: urgentValue
  };
};

/**
 * Valida los datos del formulario de producto (actualizada con precio)
 */
export const validateProductForm = (data: {
  name: string;
  expiryDate: string;
  quantity: string;
  price?: number;
}): string[] => {
  const errors: string[] = [];
  
  if (!data.name.trim()) {
    errors.push('El nombre del producto es requerido');
  }
  
  if (!data.expiryDate) {
    errors.push('La fecha de caducidad es requerida');
  } else {
    const today = new Date();
    const expiry = new Date(data.expiryDate);
    if (expiry < today) {
      errors.push('La fecha de caducidad debe ser futura');
    }
  }
  
  if (!data.quantity.trim()) {
    errors.push('La cantidad es requerida');
  }
  
  // 🆕 Validación de precio
  if (data.price !== undefined && data.price !== null) {
    if (data.price < 0) {
      errors.push('El precio no puede ser negativo');
    }
    if (data.price > 9999) {
      errors.push('El precio no puede ser mayor a 9999€');
    }
  }
  
  return errors;
};

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calcula los días restantes hasta la fecha de caducidad
 */
export const calculateDaysLeft = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * 🆕 Estima el precio de un producto basado en su nombre (fallback)
 */
export const estimatePrice = (productName: string): number => {
  const name = productName.toLowerCase();
  
  // Base de datos simple de precios estimados
  const priceEstimates: Record<string, number> = {
    // Lácteos
    'leche': 1.20,
    'yogur': 0.80,
    'queso': 3.50,
    
    // Carnes
    'pollo': 5.50,
    'carne': 8.00,
    'pescado': 12.00,
    
    // Verduras
    'tomate': 2.50,
    'lechuga': 1.50,
    'zanahoria': 1.00,
    
    // Frutas
    'manzana': 2.00,
    'plátano': 1.80,
    'naranja': 2.20,
    
    // Otros
    'pan': 1.50,
    'huevos': 2.50,
    'arroz': 1.80
  };
  
  // Buscar coincidencias
  for (const [key, price] of Object.entries(priceEstimates)) {
    if (name.includes(key)) {
      return price;
    }
  }
  
  // Precio por defecto
  return 2.50;
};
