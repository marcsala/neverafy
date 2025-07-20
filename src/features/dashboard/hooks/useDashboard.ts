// features/dashboard/hooks/useDashboard.ts

import { useState, useEffect, useCallback } from 'react';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';
import { useNotifications } from '../../../shared/hooks/useNotifications';
import { LEVEL_THRESHOLDS } from '../../../shared/utils/constants';

interface Product {
  id: string;
  name: string;
  expiryDate: string;
  price?: number;
}

interface UserStats {
  points: number;
  level: number;
  streak: number;
  totalSaved: number;
  co2Saved: number;
  ocrUsed: number;
  recipesGenerated: number;
}

/**
 * Hook personalizado para manejar la lógica del Dashboard
 */
export const useDashboard = (products: Product[], consumedProducts: any[], userStats: UserStats) => {
  const { generateExpiryNotifications } = useNotifications();

  // Calcular estadísticas principales
  const calculateStats = useCallback(() => {
    const productsArray = Array.isArray(products) ? products : [];
    
    const stats = {
      total: productsArray.length,
      expiringSoon: productsArray.filter(p => {
        const days = getDaysToExpiry(p.expiryDate);
        return days <= 3 && days >= 0;
      }).length,
      expired: productsArray.filter(p => getDaysToExpiry(p.expiryDate) < 0).length,
      totalConsumed: consumedProducts.filter(p => p.wasConsumed).length,
      totalWasted: consumedProducts.filter(p => !p.wasConsumed).length
    };

    return stats;
  }, [products, consumedProducts]);

  // Calcular nivel basado en puntos
  const calculateLevel = useCallback((points: number) => {
    let level = 1;
    
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (points >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    
    return level;
  }, []);

  // Obtener productos que necesitan atención urgente
  const getUrgentProducts = useCallback(() => {
    const productsArray = Array.isArray(products) ? products : [];
    
    return productsArray
      .filter(p => getDaysToExpiry(p.expiryDate) <= 1)
      .sort((a, b) => getDaysToExpiry(a.expiryDate) - getDaysToExpiry(b.expiryDate));
  }, [products]);

  // Calcular ahorro total estimado
  const calculateTotalSavings = useCallback(() => {
    const consumedValue = consumedProducts
      .filter(p => p.wasConsumed)
      .reduce((total, p) => total + (p.price || 3), 0);
    
    const wastedValue = consumedProducts
      .filter(p => !p.wasConsumed)
      .reduce((total, p) => total + (p.price || 3), 0);

    return {
      saved: consumedValue,
      wasted: wastedValue,
      total: consumedValue + wastedValue,
      wastePercentage: consumedValue + wastedValue > 0 ? (wastedValue / (consumedValue + wastedValue)) * 100 : 0
    };
  }, [consumedProducts]);

  // Generar recomendaciones personalizadas
  const generateRecommendations = useCallback(() => {
    const stats = calculateStats();
    const urgentProducts = getUrgentProducts();
    const recommendations: string[] = [];

    if (stats.expiringSoon > 0) {
      recommendations.push(`Tienes ${stats.expiringSoon} productos que vencen pronto. ¡Genera recetas para aprovecharlos!`);
    }

    if (stats.expired > 0) {
      recommendations.push(`Revisa ${stats.expired} productos vencidos en tu nevera.`);
    }

    if (stats.total === 0) {
      recommendations.push('Comienza añadiendo productos a tu nevera virtual para empezar a ahorrar.');
    }

    if (userStats.ocrUsed === 0) {
      recommendations.push('Prueba la función de cámara inteligente para detectar productos automáticamente.');
    }

    if (urgentProducts.length > 2) {
      recommendations.push('Considera usar recetas IA para aprovechar múltiples productos que vencen pronto.');
    }

    return recommendations;
  }, [calculateStats, getUrgentProducts, userStats]);

  // Auto-generar notificaciones de vencimiento
  useEffect(() => {
    if (products.length > 0) {
      generateExpiryNotifications(products);
    }
  }, [products, generateExpiryNotifications]);

  const stats = calculateStats();
  const urgentProducts = getUrgentProducts();
  const savings = calculateTotalSavings();
  const recommendations = generateRecommendations();
  const currentLevel = calculateLevel(userStats.points);

  return {
    stats,
    urgentProducts,
    savings,
    recommendations,
    currentLevel,
    // Funciones útiles
    getDaysToExpiry,
    calculateStats,
    getUrgentProducts,
    calculateTotalSavings
  };
};

/**
 * Hook para manejar acciones del dashboard
 */
export const useDashboardActions = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigateTo = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  const handleQuickAction = useCallback((action: string, data?: any) => {
    switch (action) {
      case 'add-product':
        navigateTo('products');
        break;
      case 'scan-product':
        navigateTo('camera');
        break;
      case 'generate-recipes':
        navigateTo('recipes');
        break;
      case 'view-analytics':
        navigateTo('analytics');
        break;
      case 'check-achievements':
        navigateTo('achievements');
        break;
      default:
        console.warn(`Acción no reconocida: ${action}`);
    }
  }, [navigateTo]);

  return {
    currentView,
    navigateTo,
    handleQuickAction
  };
};
