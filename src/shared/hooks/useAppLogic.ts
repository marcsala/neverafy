import { useMemo } from 'react';
import { getDaysToExpiry } from '../utils/dateUtils';

interface UseAppLogicProps {
  products: any[];
  consumedProducts: any[];
  searchTerm: string;
  selectedCategory: string;
}

export const useAppLogic = ({ 
  products, 
  consumedProducts, 
  searchTerm, 
  selectedCategory 
}: UseAppLogicProps) => {

  // Filtros y búsqueda
  const filteredProducts = useMemo(() => {
    const productsArray = Array.isArray(products) ? products : [];
    return productsArray.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Productos ordenados por caducidad
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const daysA = getDaysToExpiry(a.expiryDate);
      const daysB = getDaysToExpiry(b.expiryDate);
      return daysA - daysB;
    });
  }, [filteredProducts]);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const productsArray = Array.isArray(products) ? products : [];
    return {
      total: productsArray.length,
      expiringSoon: productsArray.filter(p => {
        const days = getDaysToExpiry(p.expiryDate);
        return days >= 0 && days <= 3;
      }).length,
      expired: productsArray.filter(p => getDaysToExpiry(p.expiryDate) < 0).length,
      totalConsumed: consumedProducts.filter(p => p.wasConsumed).length,
      totalWasted: consumedProducts.filter(p => !p.wasConsumed).length
    };
  }, [products, consumedProducts]);

  return {
    filteredProducts,
    sortedProducts,
    stats
  };
};