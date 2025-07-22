import { useCallback } from 'react';
import { getDaysToExpiry, getCurrentDate } from '@/shared/utils/dateUtils';
import { POINTS, DEFAULT_PRODUCT_PRICE, CO2_SAVED_PER_PRODUCT } from '@/shared/utils/constants';

interface Product {
  id: string | number;
  name: string;
  category: string;
  expiryDate: string;
  addedDate: string;
  price?: number;
  source: 'manual' | 'ocr';
  quantity?: number;
  confidence?: number;
}

interface UseProductActionsProps {
  setProducts: (updater: (prev: Product[]) => Product[]) => void;
  setConsumedProducts: (updater: (prev: any[]) => any[]) => void;
  setUserStats: (updater: (prev: any) => any) => void;
}

export const useProductActions = ({
  setProducts,
  setConsumedProducts,
  setUserStats
}: UseProductActionsProps) => {

  const addProduct = useCallback((productData: Partial<Product>) => {
    console.log('🎯 DEBUG useProductActions: addProduct called with:', productData);
    
    const product: Product = {
      id: Date.now() + Math.random(),
      addedDate: getCurrentDate(),
      price: parseFloat(String(productData.price)) || 0,
      source: 'manual',
      quantity: 1,
      ...productData,
      name: productData.name || '',
      category: productData.category || 'otros',
      expiryDate: productData.expiryDate || ''
    };
    
    console.log('🎯 DEBUG useProductActions: Created product object:', product);

    if (product.name && product.expiryDate) {
      console.log('🎯 DEBUG useProductActions: Product is valid, adding to list');
      setProducts(prev => {
        const newProducts = [...prev, product];
        console.log('🎯 DEBUG useProductActions: Previous products:', prev);
        console.log('🎯 DEBUG useProductActions: Updated products list:', newProducts);
        console.log('🎯 DEBUG useProductActions: New products length:', newProducts.length);
        return newProducts;
      });

      // Actualizar puntos
      setUserStats(prev => ({
        ...prev,
        points: prev.points + POINTS.ADD_PRODUCT
      }));
      
      console.log('🎯 DEBUG useProductActions: Product added successfully!');
      return product;
    }
    
    console.log('🚨 DEBUG useProductActions: Product is invalid - missing name or expiryDate');
    return null;
  }, [setProducts, setUserStats]);

  const markAsConsumed = useCallback((product: Product, wasConsumed = true) => {
    const consumedProduct = {
      ...product,
      consumedDate: getCurrentDate(),
      wasConsumed,
      daysBeforeExpiry: getDaysToExpiry(product.expiryDate)
    };

    setConsumedProducts(prev => [...prev, consumedProduct]);
    setProducts(prev => prev.filter(p => p.id !== product.id));

    if (wasConsumed) {
      const pointsEarned = getDaysToExpiry(product.expiryDate) >= 0 
        ? POINTS.CONSUME_PRODUCT_ON_TIME 
        : POINTS.CONSUME_PRODUCT_EXPIRED;

      setUserStats(prev => ({
        ...prev,
        points: prev.points + pointsEarned,
        totalSaved: prev.totalSaved + (product.price || DEFAULT_PRODUCT_PRICE),
        co2Saved: prev.co2Saved + CO2_SAVED_PER_PRODUCT,
        streak: prev.streak + 1
      }));
    }
  }, [setConsumedProducts, setProducts, setUserStats]);

  const removeProduct = useCallback((id: string | number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);

  const addDetectedProduct = useCallback((detectedProduct: any) => {
    const product: Product = {
      ...detectedProduct,
      id: Date.now() + Math.random(),
      addedDate: getCurrentDate(),
      source: 'ocr' as const,
      quantity: 1
    };

    const addedProduct = addProduct(product);
    if (addedProduct) {
      return `✅ ${product.name} añadido a tu nevera virtual!`;
    }
    return 'Error al añadir el producto';
  }, [addProduct]);

  return {
    addProduct,
    markAsConsumed,
    removeProduct,
    addDetectedProduct
  };
};