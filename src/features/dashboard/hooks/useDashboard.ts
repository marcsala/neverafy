// =================================
// Dashboard Main Hook (Refactored)
// =================================

import { useCallback } from 'react';
import type { DashboardProps } from '../types';
import { useProductManagement } from './useProductManagement';
import { useResponsive } from './useResponsive';
import { useNotifications } from './useNotifications';
import { useNavigation } from './useNavigation';
import { useDashboardAnalytics } from './useDashboardAnalytics';
import { useLocalState } from './useLocalState';

export const useDashboard = (userId?: string) => {
  // Hook para gestión de productos
  const {
    products,
    loading: productsLoading,
    error: productsError,
    addProduct,
    deleteProduct,
    updateProduct,
    refreshProducts,
    clearError: clearProductsError
  } = useProductManagement({ userId });

  // Hook para responsive
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Hook para notificaciones
  const {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning
  } = useNotifications();

  // Hook para navegación
  const {
    currentView,
    navigateTo,
    goBack,
    goHome,
    isCurrentView
  } = useNavigation();

  // Hook para análisis y estadísticas
  const {
    stats,
    urgentProducts,
    expiringSoonProducts,
    freshProducts,
    expiredProducts,
    wasteRisk,
    inventoryHealth,
    getHealthMessage,
    getRecommendations,
    hasUrgentProducts,
    hasExpiredProducts
  } = useDashboardAnalytics(products);

  // Hook para estado local
  const {
    isModalOpen,
    isLoading: localLoading,
    selectedProduct,
    filters,
    ui,
    openModal,
    closeModal,
    setLoading: setLocalLoading,
    selectProduct,
    setCategory,
    setUrgentOnly,
    setSearchTerm,
    resetFilters
  } = useLocalState();

  // Combinar estados de loading
  const loading = productsLoading || localLoading;

  // Combinar errores
  const error = productsError;

  // Acciones mejoradas con notificaciones
  const handleAddProduct = useCallback(async (data: any) => {
    setLocalLoading(true);
    try {
      const success = await addProduct(data);
      if (success) {
        showSuccess(`${data.name} añadido a tu nevera`);
        closeModal();
      } else {
        showError('Error al añadir producto');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showError('Error inesperado al añadir producto');
    } finally {
      setLocalLoading(false);
    }
  }, [addProduct, setLocalLoading, showSuccess, showError, closeModal]);

  const handleDeleteProduct = useCallback(async (id: number) => {
    try {
      const success = await deleteProduct(id);
      if (success) {
        showSuccess('Producto eliminado');
      } else {
        showError('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError('Error inesperado al eliminar producto');
    }
  }, [deleteProduct, showSuccess, showError]);

  const handleUpdateProduct = useCallback(async (id: number, data: any) => {
    try {
      const success = await updateProduct(id, data);
      if (success) {
        showSuccess('Producto actualizado');
      } else {
        showError('Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showError('Error inesperado al actualizar producto');
    }
  }, [updateProduct, showSuccess, showError]);

  // Navegación mejorada
  const handleNavigate = useCallback((view: string) => {
    navigateTo(view as any);
  }, [navigateTo]);

  const handleCameraAction = useCallback(() => {
    showNotification('Funcionalidad de cámara próximamente...');
  }, [showNotification]);

  // Funciones de utilidad
  const getFilteredProducts = useCallback(() => {
    let filtered = [...products];

    // Filtrar por categoría
    if (filters.category !== 'all') {
      // Implementar lógica de filtrado por categoría
      // Por ahora, filtro básico por nombre
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Filtrar solo urgentes
    if (filters.urgentOnly) {
      filtered = filtered.filter(p => p.daysLeft < 2);
    }

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, filters]);

  const clearAllErrors = useCallback(() => {
    clearProductsError();
  }, [clearProductsError]);

  return {
    // Estado principal
    products: getFilteredProducts(),
    allProducts: products, // Productos sin filtrar
    loading,
    error,
    
    // Estado de navegación
    currentView,
    
    // Estado responsive
    isMobile,
    isTablet,
    isDesktop,
    
    // Estado de UI
    isModalOpen,
    selectedProduct,
    filters,
    ui,
    
    // Notificaciones
    notification,
    
    // Análisis y estadísticas
    stats,
    urgentProducts,
    expiringSoonProducts,
    freshProducts,
    expiredProducts,
    wasteRisk,
    inventoryHealth,
    hasUrgentProducts,
    hasExpiredProducts,
    
    // Acciones de productos
    addProduct: handleAddProduct,
    deleteProduct: handleDeleteProduct,
    updateProduct: handleUpdateProduct,
    refreshProducts,
    
    // Acciones de navegación
    navigateTo: handleNavigate,
    goBack,
    goHome,
    isCurrentView,
    
    // Acciones de UI
    openModal,
    closeModal,
    selectProduct,
    
    // Acciones de filtros
    setCategory,
    setUrgentOnly,
    setSearchTerm,
    resetFilters,
    
    // Acciones de notificaciones
    showNotification,
    showSuccess,
    showError,
    showWarning,
    
    // Utilidades
    getHealthMessage,
    getRecommendations,
    clearAllErrors,
    handleCameraAction,
    
    // Funciones específicas para componentes
    setCurrentView: navigateTo,
    onNotificationClick: handleCameraAction
  };
};

// Hook simplificado para casos básicos
export const useSimpleDashboard = (userId?: string) => {
  const { products, loading, addProduct } = useProductManagement({ userId });
  const { isMobile } = useResponsive();
  const { notification, showNotification } = useNotifications();
  const { currentView, navigateTo } = useNavigation();
  const { isModalOpen, openModal, closeModal } = useLocalState();

  return {
    products,
    loading,
    isMobile,
    currentView,
    isModalOpen,
    notification,
    addProduct,
    navigateTo,
    openModal,
    closeModal,
    showNotification
  };
};
