// features/products/components/ProductList.tsx

import React from 'react';
import { Package, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';

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

interface ProductListProps {
  products: Product[];
  onMarkAsConsumed: (product: Product, wasConsumed: boolean) => void;
  onRemove: (id: string) => void;
  onEdit?: (product: Product) => void;
  viewMode?: 'grid' | 'list' | 'compact';
  showEmpty?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onMarkAsConsumed,
  onRemove,
  onEdit,
  viewMode = 'list',
  showEmpty = true
}) => {
  // Agrupar productos por urgencia
  const groupedProducts = {
    expired: products.filter(p => getDaysToExpiry(p.expiryDate) < 0),
    urgent: products.filter(p => {
      const days = getDaysToExpiry(p.expiryDate);
      return days >= 0 && days <= 1;
    }),
    soon: products.filter(p => {
      const days = getDaysToExpiry(p.expiryDate);
      return days >= 2 && days <= 3;
    }),
    fresh: products.filter(p => getDaysToExpiry(p.expiryDate) > 3)
  };

  const getGroupTitle = (groupKey: string) => {
    const titles = {
      expired: '🚨 Productos Vencidos',
      urgent: '⚡ Vence Hoy o Mañana',
      soon: '📅 Vence en 2-3 Días',
      fresh: '✅ Productos Frescos'
    };
    return titles[groupKey as keyof typeof titles] || groupKey;
  };

  const getGroupDescription = (groupKey: string, count: number) => {
    const descriptions = {
      expired: `${count} producto${count !== 1 ? 's' : ''} vencido${count !== 1 ? 's' : ''}`,
      urgent: `${count} producto${count !== 1 ? 's' : ''} que necesita${count === 1 ? '' : 'n'} atención inmediata`,
      soon: `${count} producto${count !== 1 ? 's' : ''} próximo${count !== 1 ? 's' : ''} a vencer`,
      fresh: `${count} producto${count !== 1 ? 's' : ''} fresco${count !== 1 ? 's' : ''}`
    };
    return descriptions[groupKey as keyof typeof descriptions] || `${count} productos`;
  };

  const getGroupIcon = (groupKey: string) => {
    const icons = {
      expired: AlertTriangle,
      urgent: AlertTriangle,
      soon: Calendar,
      fresh: Package
    };
    return icons[groupKey as keyof typeof icons] || Package;
  };

  const getGroupColor = (groupKey: string) => {
    const colors = {
      expired: 'text-red-600',
      urgent: 'text-orange-600',
      soon: 'text-yellow-600',
      fresh: 'text-green-600'
    };
    return colors[groupKey as keyof typeof colors] || 'text-gray-600';
  };

  const EmptyState = () => (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-700 mb-2">
        No tienes productos registrados
      </h3>
      <p className="text-gray-500 mb-6">
        ¡Agrega algunos productos para empezar a gestionar tu nevera inteligente!
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <span className="text-sm text-gray-400">
          💡 Puedes agregar productos manualmente o usar la cámara inteligente
        </span>
      </div>
    </div>
  );

  if (products.length === 0 && showEmpty) {
    return <EmptyState />;
  }

  const gridClasses = {
    grid: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
    list: 'space-y-4',
    compact: 'space-y-2'
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedProducts).map(([groupKey, groupProducts]) => {
        if (groupProducts.length === 0) return null;

        const Icon = getGroupIcon(groupKey);
        const colorClass = getGroupColor(groupKey);

        return (
          <div key={groupKey} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del grupo */}
            <div className={`px-6 py-4 border-b bg-gray-50 ${
              groupKey === 'expired' ? 'bg-red-50' :
              groupKey === 'urgent' ? 'bg-orange-50' :
              groupKey === 'soon' ? 'bg-yellow-50' : 'bg-green-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${colorClass}`} />
                  <div>
                    <h3 className={`text-lg font-semibold ${colorClass}`}>
                      {getGroupTitle(groupKey)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getGroupDescription(groupKey, groupProducts.length)}
                    </p>
                  </div>
                </div>
                
                <div className={`text-2xl font-bold ${colorClass}`}>
                  {groupProducts.length}
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="p-6">
              <div className={gridClasses[viewMode]}>
                {groupProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onMarkAsConsumed={onMarkAsConsumed}
                    onRemove={onRemove}
                    onEdit={onEdit}
                    compact={viewMode === 'compact'}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Estadísticas rápidas al final */}
      {products.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Resumen de tu Nevera
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-800">{products.length}</div>
              <div className="text-sm text-gray-600">Total productos</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">
                {groupedProducts.expired.length + groupedProducts.urgent.length}
              </div>
              <div className="text-sm text-gray-600">Necesitan atención</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {groupedProducts.fresh.length}
              </div>
              <div className="text-sm text-gray-600">Productos frescos</div>
            </div>
            
            <div className="bg-white rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {products.filter(p => p.source === 'ocr').length}
              </div>
              <div className="text-sm text-gray-600">Detectados por OCR</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
