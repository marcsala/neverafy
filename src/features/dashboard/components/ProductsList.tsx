// =================================
// Products List Component
// =================================

import React from 'react';
import type { Product } from '../types';
import { getExpiryBadge, formatPrice } from '../utils';

interface ProductsListProps {
  products: Product[];
  maxVisible?: number;
  onViewAll?: () => void;
  onProductClick?: (product: Product) => void;
  isMobile?: boolean;
  showActions?: boolean;
  showPrices?: boolean; // 🆕 Mostrar precios
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  maxVisible = 6,
  onViewAll,
  onProductClick,
  isMobile = false,
  showActions = true,
  showPrices = true // 🆕 Por defecto mostrar precios
}) => {
  const displayProducts = products.slice(0, maxVisible);

  return (
    <section className={`${isMobile ? 'px-4' : ''}`}>
      <div className="flex justify-between items-center mb-5">
        <h2 className={`font-semibold text-gray-900 ${
          isMobile ? 'text-lg' : 'text-xl'
        }`}>
          Mi nevera
        </h2>
        {onViewAll && showActions && (
          <button 
            onClick={onViewAll}
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
          >
            Ver todo
          </button>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M2.5 2v6h19V2"/>
              <path d="M2.5 8v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V8"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tu nevera está vacía</h3>
          <p className="text-gray-500 mb-4">Comienza añadiendo productos para gestionar tu inventario</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayProducts.map((product) => {
            const badge = getExpiryBadge(product.daysLeft);
            
            return (
              <div 
                key={product.id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-colors ${
                  onProductClick ? 'cursor-pointer hover:border-blue-200 hover:shadow-md' : ''
                } ${isMobile ? 'p-4' : 'p-5'}`}
                onClick={() => onProductClick?.(product)}
              >
                <div className="flex-1">
                  <div className={`font-semibold text-gray-900 mb-1 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    {product.name}
                  </div>
                  <div className={`text-gray-500 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {product.quantity}
                  </div>
                  {/* 🆕 Mostrar precio si está disponible */}
                  {showPrices && product.price && (
                    <div className={`text-blue-600 font-medium mt-1 ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      {formatPrice(product.price)}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`inline-block rounded-full font-semibold mb-1 ${
                    isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                  } ${
                    badge.class === 'urgent' ? 'bg-red-50 text-red-600' :
                    badge.class === 'warning' ? 'bg-amber-50 text-amber-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {badge.text}
                  </div>
                  <div className={`text-gray-400 ${
                    isMobile ? 'text-xs' : 'text-xs'
                  }`}>
                    {product.daysLeft > 0 ? `${product.daysLeft} días` : 'Vencido'}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Mostrar indicador si hay más productos */}
          {products.length > maxVisible && (
            <div className="text-center pt-4">
              <button
                onClick={onViewAll}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Y {products.length - maxVisible} productos más...
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductsList;
