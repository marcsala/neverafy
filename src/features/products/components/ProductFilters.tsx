// features/products/components/ProductFilters.tsx

import React from 'react';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { CATEGORIES } from '../../../shared/utils/constants';
import { formatCategory } from '../../../shared/utils/formatters';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  productCount: number;
  filteredCount: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  productCount,
  filteredCount
}) => {
  const sortOptions = [
    { value: 'expiry', label: 'Fecha de vencimiento' },
    { value: 'name', label: 'Nombre' },
    { value: 'category', label: 'Categoría' },
    { value: 'added', label: 'Fecha agregado' },
    { value: 'price', label: 'Precio' }
  ];

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onSortChange('expiry');
    onSortOrderChange('asc');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'expiry' || sortOrder !== 'asc';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Header con contador */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">
            Filtros y Búsqueda
          </h3>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {filteredCount === productCount 
              ? `${productCount} productos`
              : `${filteredCount} de ${productCount} productos`
            }
          </span>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre de producto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {formatCategory(cat)}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Orden */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Orden
          </label>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <>
                <SortAsc size={16} />
                Ascendente
              </>
            ) : (
              <>
                <SortDesc size={16} />
                Descendente
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vista rápida de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-gray-500">Filtros activos:</span>
          
          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              Búsqueda: "{searchTerm}"
              <button onClick={() => onSearchChange('')}>
                <X size={12} />
              </button>
            </span>
          )}
          
          {selectedCategory !== 'all' && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {formatCategory(selectedCategory)}
              <button onClick={() => onCategoryChange('all')}>
                <X size={12} />
              </button>
            </span>
          )}
          
          {(sortBy !== 'expiry' || sortOrder !== 'asc') && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {sortOptions.find(o => o.value === sortBy)?.label} ({sortOrder === 'asc' ? '↑' : '↓'})
              <button onClick={() => { onSortChange('expiry'); onSortOrderChange('asc'); }}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
