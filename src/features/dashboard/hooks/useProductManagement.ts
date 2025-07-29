// =================================
// Product Management Hook
// =================================

import { useState, useCallback, useEffect } from 'react';
import type { Product, ProductFormData, SupabaseProduct } from '../types';
import { 
  convertSupabaseProduct, 
  validateProductForm, 
  calculateDaysLeft,
  estimatePrice 
} from '../utils';
import { MOCK_PRODUCTS } from '../utils/mockData';
import { useSupabaseProducts } from '../../../shared/hooks/useSupabase';

interface UseProductManagementOptions {
  userId?: string;
  initialProducts?: Product[];
  enableMockData?: boolean;
}

export const useProductManagement = ({
  userId,
  initialProducts = [],
  enableMockData = true
}: UseProductManagementOptions = {}) => {
  // Estado local
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks de Supabase
  const { 
    products: supabaseProducts, 
    loading: supabaseLoading,
    addProduct: addSupabaseProduct, 
    deleteProduct: deleteSupabaseProduct,
    updateProduct: updateSupabaseProduct,
    refetch: refetchProducts
  } = useSupabaseProducts(userId);

  // Sincronizar productos de Supabase
  useEffect(() => {
    if (supabaseProducts.length > 0) {
      const convertedProducts = supabaseProducts.map(convertSupabaseProduct);
      setProducts(convertedProducts);
    } else if (products.length === 0 && enableMockData) {
      // Usar productos mock si no hay datos reales
      setProducts(MOCK_PRODUCTS);
    }
  }, [supabaseProducts, enableMockData]);

  // Sincronizar loading state
  useEffect(() => {
    setLoading(supabaseLoading);
  }, [supabaseLoading]);

  // Añadir producto
  const addProduct = useCallback(async (data: ProductFormData): Promise<boolean> => {
    // Validar datos
    const errors = validateProductForm(data);
    if (errors.length > 0) {
      setError(`Validación: ${errors[0]}`);
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 🆕 Auto-estimar precio si no se proporciona
      const finalPrice = data.price || (data.name ? estimatePrice(data.name) : undefined);

      if (userId) {
        // Intentar guardar en Supabase
        const supabaseProduct = await addSupabaseProduct({
          name: data.name,
          category: data.category || 'general',
          expiry_date: data.expiryDate,
          quantity: data.quantity,
          price: finalPrice, // 🆕 Incluir precio
          source: 'manual'
        });
        
        if (supabaseProduct) {
          // El useEffect se encargará de actualizar la lista
          return true;
        }
      }
      
      // Fallback: añadir localmente
      const daysLeft = calculateDaysLeft(data.expiryDate);
      
      const newProduct: Product = {
        id: Date.now(),
        name: data.name,
        quantity: data.quantity,
        expiryDate: data.expiryDate,
        daysLeft: daysLeft,
        price: finalPrice // 🆕 Incluir precio
      };
      
      setProducts(prev => [...prev, newProduct]);
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error al añadir producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, addSupabaseProduct]);

  // Eliminar producto
  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (userId) {
        await deleteSupabaseProduct(id.toString());
      }
      
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al eliminar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, deleteSupabaseProduct]);

  // Actualizar producto
  const updateProduct = useCallback(async (
    id: number, 
    data: Partial<ProductFormData>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (userId && updateSupabaseProduct) {
        // TODO: Implementar actualización en Supabase con precio
        // await updateSupabaseProduct(id.toString(), { ...data, price: data.price });
      }
      
      setProducts(prev => prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              ...(data.name && { name: data.name }),
              ...(data.quantity && { quantity: data.quantity }),
              ...(data.price !== undefined && { price: data.price }), // 🆕 Actualizar precio
              ...(data.expiryDate && { 
                expiryDate: data.expiryDate,
                daysLeft: calculateDaysLeft(data.expiryDate)
              })
            }
          : p
      ));
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error al actualizar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, updateSupabaseProduct]);

  // 🆕 Marcar producto como consumido (para cálculos de ahorro)
  const markAsConsumed = useCallback(async (id: number): Promise<boolean> => {
    try {
      // TODO: Implementar en Supabase tabla de productos consumidos
      // Por ahora, solo eliminar del inventario
      return await deleteProduct(id);
    } catch (error) {
      console.error('Error marking product as consumed:', error);
      return false;
    }
  }, [deleteProduct]);

  // 🆕 Calcular valor total del inventario
  const getTotalValue = useCallback((): number => {
    return products.reduce((total, product) => total + (product.price || 0), 0);
  }, [products]);

  // 🆕 Calcular valor de productos urgentes
  const getUrgentValue = useCallback((): number => {
    return products
      .filter(p => p.daysLeft < 2)
      .reduce((total, product) => total + (product.price || 0), 0);
  }, [products]);

  // Recargar productos
  const refreshProducts = useCallback(async () => {
    if (refetchProducts) {
      setLoading(true);
      try {
        await refetchProducts();
      } catch (error) {
        console.error('Error refreshing products:', error);
        setError('Error al recargar productos');
      } finally {
        setLoading(false);
      }
    }
  }, [refetchProducts]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    products,
    loading,
    error,
    
    // Acciones
    addProduct,
    deleteProduct,
    updateProduct,
    markAsConsumed, // 🆕 Nueva acción
    refreshProducts,
    clearError,
    
    // 🆕 Cálculos de valor
    getTotalValue,
    getUrgentValue,
    
    // Utilidades
    setProducts // Para casos especiales
  };
};
