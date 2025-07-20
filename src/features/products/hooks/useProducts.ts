// features/products/hooks/useProducts.ts

import { useState, useCallback, useMemo } from 'react';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';
import { normalizeProductName } from '../../../shared/utils/formatters';
import { CATEGORIES } from '../../../shared/utils/constants';

interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
  price?: number;
  source?: string;
  confidence?: number;
  addedDate?: string;
}

export interface ProductFilters {
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Hook para manejar el filtrado y ordenamiento de productos
 */
export const useProductFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'expiry',
    sortOrder: 'asc'
  });

  const updateFilter = useCallback((key: keyof ProductFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      selectedCategory: 'all',
      sortBy: 'expiry',
      sortOrder: 'asc'
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtro por búsqueda
      const matchesSearch = normalizeProductName(product.name).includes(
        normalizeProductName(filters.searchTerm)
      );
      
      // Filtro por categoría
      const matchesCategory = filters.selectedCategory === 'all' || 
                             product.category === filters.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, filters.searchTerm, filters.selectedCategory]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (filters.sortBy) {
        case 'expiry':
          compareValue = getDaysToExpiry(a.expiryDate) - getDaysToExpiry(b.expiryDate);
          break;
        case 'name':
          compareValue = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
          break;
        case 'category':
          compareValue = a.category.localeCompare(b.category);
          break;
        case 'added':
          const dateA = new Date(a.addedDate || a.expiryDate);
          const dateB = new Date(b.addedDate || b.expiryDate);
          compareValue = dateA.getTime() - dateB.getTime();
          break;
        case 'price':
          compareValue = (a.price || 0) - (b.price || 0);
          break;
        case 'quantity':
          compareValue = a.quantity - b.quantity;
          break;
        default:
          compareValue = 0;
      }

      return filters.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [filteredProducts, filters.sortBy, filters.sortOrder]);

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredProducts,
    sortedProducts,
    hasActiveFilters: filters.searchTerm !== '' || 
                     filters.selectedCategory !== 'all' || 
                     filters.sortBy !== 'expiry' || 
                     filters.sortOrder !== 'asc'
  };
};

/**
 * Hook para estadísticas de productos
 */
export const useProductStats = (products: Product[]) => {
  return useMemo(() => {
    const stats = {
      total: products.length,
      expired: 0,
      urgent: 0,
      soon: 0,
      fresh: 0,
      categories: {} as Record<string, number>,
      sources: { manual: 0, ocr: 0 },
      totalValue: 0,
      averagePrice: 0
    };

    products.forEach(product => {
      const daysToExpiry = getDaysToExpiry(product.expiryDate);
      
      // Clasificar por urgencia
      if (daysToExpiry < 0) {
        stats.expired++;
      } else if (daysToExpiry <= 1) {
        stats.urgent++;
      } else if (daysToExpiry <= 3) {
        stats.soon++;
      } else {
        stats.fresh++;
      }

      // Contar por categorías
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;

      // Contar por fuente
      if (product.source === 'ocr') {
        stats.sources.ocr++;
      } else {
        stats.sources.manual++;
      }

      // Calcular valor total
      if (product.price) {
        stats.totalValue += product.price;
      }
    });

    // Calcular precio promedio
    const productsWithPrice = products.filter(p => p.price && p.price > 0);
    stats.averagePrice = productsWithPrice.length > 0 
      ? stats.totalValue / productsWithPrice.length 
      : 0;

    return stats;
  }, [products]);
};

/**
 * Hook para recomendaciones basadas en productos
 */
export const useProductRecommendations = (products: Product[]) => {
  return useMemo(() => {
    const recommendations: string[] = [];
    const stats = {
      expired: products.filter(p => getDaysToExpiry(p.expiryDate) < 0).length,
      urgent: products.filter(p => {
        const days = getDaysToExpiry(p.expiryDate);
        return days >= 0 && days <= 1;
      }).length,
      soon: products.filter(p => {
        const days = getDaysToExpiry(p.expiryDate);
        return days >= 2 && days <= 3;
      }).length,
      total: products.length
    };

    if (stats.expired > 0) {
      recommendations.push(
        `🚨 Tienes ${stats.expired} producto${stats.expired > 1 ? 's' : ''} vencido${stats.expired > 1 ? 's' : ''}. Revísalo${stats.expired > 1 ? 's' : ''} y elimínalo${stats.expired > 1 ? 's' : ''} si es necesario.`
      );
    }

    if (stats.urgent > 0) {
      recommendations.push(
        `⚡ ${stats.urgent} producto${stats.urgent > 1 ? 's' : ''} vence${stats.urgent === 1 ? '' : 'n'} hoy o mañana. ¡Úsalo${stats.urgent > 1 ? 's' : ''} pronto!`
      );
    }

    if (stats.soon > 0) {
      recommendations.push(
        `📅 ${stats.soon} producto${stats.soon > 1 ? 's' : ''} vence${stats.soon === 1 ? '' : 'n'} en 2-3 días. Planifica su uso.`
      );
    }

    if (stats.urgent + stats.soon >= 3) {
      recommendations.push(
        '🍳 Considera generar recetas IA para aprovechar múltiples productos que vencen pronto.'
      );
    }

    if (stats.total === 0) {
      recommendations.push(
        '📦 Tu nevera está vacía. ¡Agrega algunos productos para empezar a gestionar tu alimentación!'
      );
    }

    if (stats.total > 0 && stats.expired === 0 && stats.urgent === 0) {
      recommendations.push(
        '✅ ¡Excelente! No tienes productos urgentes. Tu gestión es muy buena.'
      );
    }

    // Recomendaciones por categorías faltantes
    const presentCategories = new Set(products.map(p => p.category));
    const missingBasics = ['frutas', 'verduras', 'lácteos'].filter(cat => !presentCategories.has(cat));
    
    if (missingBasics.length > 0 && stats.total > 0) {
      recommendations.push(
        `🥗 Considera agregar ${missingBasics.join(', ')} para una dieta más balanceada.`
      );
    }

    return recommendations;
  }, [products]);
};

/**
 * Hook para exportar/importar productos
 */
export const useProductImportExport = () => {
  const exportToCSV = useCallback((products: Product[], filename?: string) => {
    const csvHeader = 'Nombre,Categoría,Fecha Vencimiento,Cantidad,Precio,Fuente,Añadido\n';
    const csvData = products.map(p => 
      `"${p.name}","${p.category}","${p.expiryDate}","${p.quantity}","${p.price || ''}","${p.source || 'manual'}","${p.addedDate || ''}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `neverafy-productos-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const exportToJSON = useCallback((products: Product[], filename?: string) => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      products: products
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `neverafy-productos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importFromCSV = useCallback((file: File): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const products: Product[] = [];
          
          // Saltar header
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parse CSV simple (mejorar con librería si es necesario)
            const columns = line.split(',').map(col => col.replace(/"/g, ''));
            
            if (columns.length >= 4) {
              products.push({
                id: Date.now() + Math.random(),
                name: columns[0],
                category: CATEGORIES.includes(columns[1]) ? columns[1] : 'otros',
                expiryDate: columns[2],
                quantity: parseInt(columns[3]) || 1,
                price: parseFloat(columns[4]) || undefined,
                source: columns[5] || 'manual',
                addedDate: columns[6] || new Date().toISOString().split('T')[0]
              });
            }
          }
          
          resolve(products);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error leyendo archivo'));
      reader.readAsText(file);
    });
  }, []);

  return {
    exportToCSV,
    exportToJSON,
    importFromCSV
  };
};

/**
 * Hook principal para manejar todos los aspectos de productos
 */
export const useProducts = (initialProducts: Product[] = []) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  const filterHook = useProductFilters(products);
  const stats = useProductStats(products);
  const recommendations = useProductRecommendations(products);
  const importExportHook = useProductImportExport();

  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `${Date.now()}-${Math.random()}`,
      addedDate: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [...prev, product]);
    return product;
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((category: string) => {
    return products.filter(p => p.category === category);
  }, [products]);

  const getExpiringProducts = useCallback((days: number = 3) => {
    return products.filter(p => {
      const daysToExpiry = getDaysToExpiry(p.expiryDate);
      return daysToExpiry >= 0 && daysToExpiry <= days;
    });
  }, [products]);

  return {
    products,
    setProducts,
    addProduct,
    removeProduct,
    updateProduct,
    getProductById,
    getProductsByCategory,
    getExpiringProducts,
    stats,
    recommendations,
    ...filterHook,
    ...importExportHook
  };
};
