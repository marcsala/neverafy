import { useEffect } from 'react';

// Hooks compartidos
import { useAuth, useLocalStorage, useNotifications, useAppLogic } from './index';

// Hooks de features
import { useProductActions } from '../../features/products';
import { useOCRLogic } from '../../features/camera';
import { useRecipeGeneration } from '../../features/recipes';

// Store
import useStore from '../../store/useStore';

export const useAppHooks = () => {
  // Auth hook
  const authData = useAuth();
  const { session, loading, signOut } = authData;
  
  // Store global
  const storeData = useStore();
  const {
    currentView,
    products,
    consumedProducts,
    userStats,
    notifications,
    isPremium,
    setCurrentView,
    setProducts,
    setConsumedProducts,
    setUserStats,
    setNotifications,
    setIsPremium,
    searchTerm,
    selectedCategory
  } = storeData;

  // Hook para persistencia localStorage
  useLocalStorage({
    session,
    products,
    consumedProducts,
    userStats,
    notifications,
    isPremium,
    setProducts,
    setConsumedProducts,
    setUserStats,
    setNotifications,
    setIsPremium
  });

  // Hook para notificaciones
  const notificationActions = useNotifications({
    products,
    setNotifications
  });

  // Hook para lógica de productos
  const productActions = useProductActions({
    setProducts,
    setConsumedProducts,
    setUserStats
  });

  // Hook para lógica OCR
  const ocrLogic = useOCRLogic({
    isPremium,
    userStats,
    setUserStats
  });

  // Hook para generación de recetas
  const recipeLogic = useRecipeGeneration({
    products,
    isPremium,
    userStats,
    setUserStats
  });

  // Hook para lógica de la app (estadísticas, filtros)
  const appLogic = useAppLogic({
    products,
    consumedProducts,
    searchTerm,
    selectedCategory
  });

  // Generar notificaciones cuando cambien los productos
  useEffect(() => {
    if (session && Array.isArray(products) && products.length > 0) {
      notificationActions.generateNotifications();
    }
  }, [session, products, notificationActions.generateNotifications]);

  return {
    // Auth
    session,
    loading,
    signOut,
    
    // Store data
    currentView,
    products,
    consumedProducts,
    userStats,
    notifications,
    isPremium,
    setCurrentView,
    setIsPremium,
    
    // Actions
    productActions,
    ocrLogic,
    recipeLogic,
    
    // App logic
    stats: appLogic.stats
  };
};