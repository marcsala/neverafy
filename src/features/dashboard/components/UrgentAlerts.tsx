// =================================
// Urgent Alerts Component
// =================================

import React from 'react';
import type { Product } from '../types';

interface UrgentAlertsProps {
  urgentProducts: Product[];
  onViewRecipes: () => void;
  isMobile?: boolean;
}

const UrgentAlerts: React.FC<UrgentAlertsProps> = ({
  urgentProducts,
  onViewRecipes,
  isMobile = false
}) => {
  if (urgentProducts.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-3 ${isMobile ? 'px-4' : ''}`}>
      {urgentProducts.map((product) => {
        const isToday = product.daysLeft < 1;
        return (
          <div
            key={product.id}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${
              isMobile ? 'p-4' : 'p-5'
            } ${isToday ? 'border-red-500' : 'border-amber-500'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className={`font-semibold text-gray-900 mb-1 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  <span className="text-red-600">⚠️ </span>
                  {product.name} {isToday ? 'caduca hoy' : 'caduca mañana'}
                </div>
                <div className={`text-gray-500 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  {product.quantity}
                </div>
                {isToday && (
                  <div className="text-xs text-red-600 font-medium mt-1">
                    ¡Úsalo antes de que se venza!
                  </div>
                )}
              </div>
              <button 
                onClick={onViewRecipes}
                className={`text-blue-600 font-medium hover:text-blue-700 transition-colors ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}
              >
                Ver recetas ✨
              </button>
            </div>
          </div>
        );
      })}
      
      {/* Resumen de urgencias */}
      {urgentProducts.length > 1 && (
        <div className={`text-center ${isMobile ? 'mt-3' : 'mt-4'}`}>
          <button
            onClick={onViewRecipes}
            className={`bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-amber-600 transition-colors ${
              isMobile 
                ? 'px-4 py-2 text-sm' 
                : 'px-6 py-3'
            }`}
          >
            🚨 Generar recetas con {urgentProducts.length} productos urgentes
          </button>
        </div>
      )}
    </section>
  );
};

export default UrgentAlerts;
