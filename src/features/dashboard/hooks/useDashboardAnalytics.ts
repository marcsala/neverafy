// =================================
// Dashboard Analytics Hook
// =================================

import { useMemo, useCallback } from 'react';
import type { Product, DashboardStats } from '../types';
import { 
  getUrgentProducts, 
  getExpiringSoonCount,
  calculateTotalValue,
  calculateUrgentValue,
  formatPrice
} from '../utils';

interface UseAnalyticsOptions {
  enableRealTimeUpdates?: boolean;
  customCalculations?: Record<string, (products: Product[]) => any>;
  consumedProductIds?: number[]; // 🆕 IDs de productos consumidos para cálculo de ahorro
}

interface AnalyticsData {
  // Estadísticas básicas
  stats: DashboardStats;
  
  // Productos categorizados
  urgentProducts: Product[];
  expiringSoonProducts: Product[];
  freshProducts: Product[];
  expiredProducts: Product[];
  
  // 🆕 Métricas de valor
  totalValue: number;
  urgentValue: number;
  averagePrice: number;
  
  // Métricas avanzadas
  wasteRisk: number; // Porcentaje de riesgo de desperdicio
  inventoryHealth: 'excellent' | 'good' | 'warning' | 'critical';
  averageDaysLeft: number;
  categoryBreakdown: Record<string, number>;
  
  // 🆕 Análisis de ahorro
  savingsAnalysis: {
    totalSaved: number;
    totalWasted: number;
    wastePercentage: number;
    potentialSavings: number;
  };
  
  // Tendencias (requiere datos históricos)
  trends: {
    productsAdded: number;
    productsConsumed: number;
    wasteReduction: number;
  };
}

export const useDashboardAnalytics = (
  products: Product[],
  options: UseAnalyticsOptions = {}
) => {
  const { consumedProductIds = [] } = options;

  // 🆕 Calcular métricas de valor
  const valueMetrics = useMemo(() => {
    const totalValue = calculateTotalValue(products);
    const urgentValue = calculateUrgentValue(products);
    const averagePrice = products.length > 0 ? totalValue / products.length : 0;
    
    return { totalValue, urgentValue, averagePrice };
  }, [products]);

  // Calcular estadísticas básicas
  const stats = useMemo((): DashboardStats => {
    const expiringSoon = getExpiringSoonCount(products);
    
    // 🆕 Cálculo de ahorro real basado en productos consumidos
    const savedProducts = products.filter(p => consumedProductIds.includes(p.id));
    const realSavings = savedProducts.reduce((total, p) => total + (p.price || 0), 0);
    
    // Si no hay datos reales, usar estimación basada en valor total
    const estimatedSavings = valueMetrics.totalValue * 0.25; // 25% del valor total
    const finalSavings = realSavings > 0 ? realSavings : Math.min(estimatedSavings, 47);

    return {
      totalProducts: products.length,
      expiringSoon,
      savedMoney: formatPrice(finalSavings),
      co2Saved: '2.3kg', // TODO: Calcular basado en productos reales
      totalValue: valueMetrics.totalValue,
      potentialWaste: valueMetrics.urgentValue
    };
  }, [products, consumedProductIds, valueMetrics]);

  // Categorizar productos por urgencia
  const { urgentProducts, expiringSoonProducts, freshProducts, expiredProducts } = useMemo(() => {
    const urgent = getUrgentProducts(products);
    const expiringSoon = products.filter(p => p.daysLeft >= 2 && p.daysLeft <= 4);
    const fresh = products.filter(p => p.daysLeft > 4);
    const expired = products.filter(p => p.daysLeft < 0);

    return {
      urgentProducts: urgent,
      expiringSoonProducts: expiringSoon,
      freshProducts: fresh,
      expiredProducts: expired
    };
  }, [products]);

  // 🆕 Análisis de ahorro detallado
  const savingsAnalysis = useMemo(() => {
    const consumedProducts = products.filter(p => consumedProductIds.includes(p.id));
    const wastedProducts = expiredProducts.filter(p => !consumedProductIds.includes(p.id));
    
    const totalSaved = consumedProducts.reduce((total, p) => total + (p.price || 0), 0);
    const totalWasted = wastedProducts.reduce((total, p) => total + (p.price || 0), 0);
    const total = totalSaved + totalWasted;
    const wastePercentage = total > 0 ? (totalWasted / total) * 100 : 0;
    const potentialSavings = urgentProducts.reduce((total, p) => total + (p.price || 0), 0);
    
    return {
      totalSaved,
      totalWasted,
      wastePercentage,
      potentialSavings
    };
  }, [products, consumedProductIds, expiredProducts, urgentProducts]);

  // Calcular métricas avanzadas
  const analytics = useMemo((): AnalyticsData => {
    const totalProducts = products.length;
    
    // Riesgo de desperdicio basado en valor, no solo cantidad
    const riskyValue = valueMetrics.urgentValue + savingsAnalysis.totalWasted;
    const wasteRisk = valueMetrics.totalValue > 0 ? (riskyValue / valueMetrics.totalValue) * 100 : 0;
    
    // Salud del inventario basada en riesgo financiero
    let inventoryHealth: AnalyticsData['inventoryHealth'] = 'excellent';
    if (wasteRisk > 40) inventoryHealth = 'critical';
    else if (wasteRisk > 25) inventoryHealth = 'warning';
    else if (wasteRisk > 10) inventoryHealth = 'good';
    
    // Promedio de días restantes
    const totalDays = products.reduce((sum, p) => sum + Math.max(0, p.daysLeft), 0);
    const averageDaysLeft = totalProducts > 0 ? totalDays / totalProducts : 0;
    
    // 🆕 Desglose por categorías con valor
    const categoryBreakdown = products.reduce((acc, product) => {
      // Determinar categoría por nombre (lógica mejorada)
      let category = 'otros';
      const name = product.name.toLowerCase();
      
      if (name.includes('leche') || name.includes('yogur') || name.includes('queso')) {
        category = 'lacteos';
      } else if (name.includes('tomate') || name.includes('lechuga') || name.includes('verdura')) {
        category = 'verduras';
      } else if (name.includes('pollo') || name.includes('carne') || name.includes('pescado') || name.includes('salmón')) {
        category = 'carnes';
      } else if (name.includes('pan') || name.includes('arroz') || name.includes('pasta')) {
        category = 'carbohidratos';
      } else if (name.includes('manzana') || name.includes('plátano') || name.includes('naranja') || name.includes('aguacate')) {
        category = 'frutas';
      }
      
      acc[category] = (acc[category] || 0) + (product.price || 0);
      return acc;
    }, {} as Record<string, number>);

    // Tendencias simuladas mejoradas
    const trends = {
      productsAdded: Math.floor(Math.random() * 10) + 5,
      productsConsumed: Math.floor(Math.random() * 8) + 3,
      wasteReduction: Math.max(0, 20 - wasteRisk) // Reducción basada en performance actual
    };

    return {
      stats,
      urgentProducts,
      expiringSoonProducts,
      freshProducts,
      expiredProducts,
      totalValue: valueMetrics.totalValue,
      urgentValue: valueMetrics.urgentValue,
      averagePrice: valueMetrics.averagePrice,
      wasteRisk,
      inventoryHealth,
      averageDaysLeft,
      categoryBreakdown,
      savingsAnalysis,
      trends
    };
  }, [products, stats, urgentProducts, expiringSoonProducts, freshProducts, expiredProducts, valueMetrics, savingsAnalysis]);

  // Funciones de análisis específicas
  const getHealthColor = useCallback(() => {
    const colors = {
      excellent: 'green',
      good: 'blue',
      warning: 'amber',
      critical: 'red'
    };
    return colors[analytics.inventoryHealth];
  }, [analytics.inventoryHealth]);

  const getHealthMessage = useCallback(() => {
    const messages = {
      excellent: '¡Tu nevera está perfecta! Sigue así.',
      good: 'Tu nevera está en buen estado.',
      warning: 'Algunos productos necesitan atención.',
      critical: '¡Revisa tu nevera urgentemente!'
    };
    return messages[analytics.inventoryHealth];
  }, [analytics.inventoryHealth]);

  // 🆕 Recomendaciones mejoradas con contexto de precio
  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (analytics.urgentProducts.length > 0) {
      const urgentValue = analytics.urgentValue;
      if (urgentValue > 10) {
        recommendations.push(`Tienes ${formatPrice(urgentValue)} en productos que caducan pronto. ¡Consúmelos ya!`);
      } else {
        recommendations.push(`Consume ${analytics.urgentProducts.length} productos que caducan pronto`);
      }
    }
    
    if (analytics.expiredProducts.length > 0) {
      recommendations.push(`Retira ${analytics.expiredProducts.length} productos vencidos`);
    }
    
    if (analytics.savingsAnalysis.potentialSavings > 5) {
      recommendations.push(`Puedes ahorrar ${formatPrice(analytics.savingsAnalysis.potentialSavings)} actuando ahora`);
    }
    
    if (analytics.wasteRisk > 30) {
      recommendations.push('Considera generar recetas para aprovechar productos urgentes');
    }
    
    if (products.length === 0) {
      recommendations.push('Añade productos a tu nevera para comenzar a ahorrar');
    }
    
    if (analytics.averageDaysLeft < 2) {
      recommendations.push('Planifica tus comidas para esta semana');
    }

    // 🆕 Recomendación basada en valor promedio
    if (analytics.averagePrice > 8) {
      recommendations.push('Tienes productos de alto valor. ¡Cuídalos bien!');
    }

    return recommendations;
  }, [analytics, products.length]);

  const getMostCommonCategory = useCallback(() => {
    const categories = Object.entries(analytics.categoryBreakdown);
    if (categories.length === 0) return null;
    
    return categories.reduce((max, [category, value]) => 
      value > max.value ? { category, value } : max
    , { category: '', value: 0 });
  }, [analytics.categoryBreakdown]);

  // 🆕 Calcular ROI de usar Neverafy
  const calculateROI = useCallback(() => {
    const monthlyWaste = analytics.savingsAnalysis.totalWasted;
    const monthlySavings = analytics.savingsAnalysis.totalSaved;
    const improvementPotential = analytics.savingsAnalysis.potentialSavings;
    
    return {
      currentWasteReduction: monthlySavings,
      potentialAdditionalSavings: improvementPotential,
      annualSavingsPotential: (monthlySavings + improvementPotential) * 12
    };
  }, [analytics.savingsAnalysis]);

  return {
    // Datos de análisis
    ...analytics,
    
    // Funciones utilitarias
    getHealthColor,
    getHealthMessage,
    getRecommendations,
    getMostCommonCategory,
    calculateROI, // 🆕 Nueva función
    
    // Métricas calculadas
    hasUrgentProducts: analytics.urgentProducts.length > 0,
    hasExpiredProducts: analytics.expiredProducts.length > 0,
    isInventoryEmpty: products.length === 0,
    wasteRiskLevel: analytics.wasteRisk > 50 ? 'high' : analytics.wasteRisk > 20 ? 'medium' : 'low',
    
    // 🆕 Métricas de valor
    hasHighValueProducts: analytics.averagePrice > 5,
    totalInventoryValue: formatPrice(analytics.totalValue),
    averageProductValue: formatPrice(analytics.averagePrice)
  };
};

// Hook simplificado para estadísticas básicas con precios
export const useBasicStats = (products: Product[]) => {
  return useMemo(() => {
    const urgent = getUrgentProducts(products);
    const expiringSoon = getExpiringSoonCount(products);
    const totalValue = calculateTotalValue(products);
    const urgentValue = calculateUrgentValue(products);
    
    return {
      totalProducts: products.length,
      urgentCount: urgent.length,
      expiringSoonCount: expiringSoon,
      urgentProducts: urgent,
      totalValue,
      urgentValue,
      averagePrice: products.length > 0 ? totalValue / products.length : 0
    };
  }, [products]);
};
