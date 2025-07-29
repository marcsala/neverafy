// =================================
// Stats Grid Component
// =================================

import React from 'react';
import type { DashboardStats } from '../types';
import { formatPrice } from '../utils';

interface StatsGridProps {
  stats: DashboardStats;
  isMobile?: boolean;
  variant?: 'default' | 'compact' | 'sidebar';
}

const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  isMobile = false,
  variant = 'default'
}) => {
  const statItems = [
    {
      value: stats.totalProducts,
      label: 'Total productos',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 2v6h19V2"/>
          <path d="M2.5 8v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V8"/>
        </svg>
      ),
      color: 'blue'
    },
    {
      value: stats.expiringSoon,
      label: 'Caducan pronto',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="m12 17 .01 0"/>
        </svg>
      ),
      color: 'amber'
    },
    {
      value: stats.savedMoney,
      label: 'Ahorrado este mes',
      subtext: stats.totalValue ? `de ${formatPrice(stats.totalValue)} total` : undefined, // 🆕 Subtexto con valor total
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      color: 'green'
    },
    {
      value: stats.co2Saved,
      label: 'CO₂ evitado',
      subtext: stats.potentialWaste ? `⚠️ ${formatPrice(stats.potentialWaste)} en riesgo` : undefined, // 🆕 Alerta de desperdicio
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18l-2 9H5L3 6Z"/>
          <path d="m3 6-2-2"/>
          <path d="m3 6 2 2"/>
        </svg>
      ),
      color: 'emerald'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      amber: 'text-amber-600 bg-amber-50',
      green: 'text-green-600 bg-green-50',
      emerald: 'text-emerald-600 bg-emerald-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  // Determinar la clase de grid según la variante
  const getGridClasses = () => {
    if (variant === 'compact' || isMobile) {
      return 'grid grid-cols-2 gap-3';
    }
    if (variant === 'sidebar') {
      return 'grid grid-cols-2 gap-4'; // Siempre 2x2 para sidebar
    }
    return 'grid grid-cols-2 lg:grid-cols-4 gap-4'; // 4 columnas para layout principal
  };

  // Variante compacta para móvil
  if (variant === 'compact') {
    return (
      <div className={getGridClasses()}>
        {statItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
          >
            <div className="text-lg font-bold text-gray-900 mb-1">
              {item.value}
            </div>
            <div className="text-xs text-gray-500">
              {item.label}
            </div>
            {/* 🆕 Subtexto en versión compacta */}
            {item.subtext && (
              <div className="text-xs text-gray-400 mt-1 truncate">
                {item.subtext}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Variante completa (default y sidebar)
  return (
    <div className={`${isMobile ? 'px-4' : ''}`}>
      <div className={getGridClasses()}>
        {statItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`${
              variant === 'sidebar' ? 'p-4' : isMobile ? 'p-4' : 'p-5'
            }`}>
              {/* Icon */}
              <div className={`inline-flex items-center justify-center rounded-lg mb-3 ${
                variant === 'sidebar' ? 'w-10 h-10' : 'w-12 h-12'
              } ${getColorClasses(item.color)}`}>
                <div className={variant === 'sidebar' ? 'w-5 h-5' : 'w-6 h-6'}>
                  {item.icon}
                </div>
              </div>
              
              {/* Value */}
              <div className={`font-bold text-gray-900 mb-1 ${
                variant === 'sidebar' ? 'text-xl' : 
                isMobile ? 'text-xl' : 'text-2xl'
              }`}>
                {item.value}
              </div>
              
              {/* Label */}
              <div className={`text-gray-500 font-medium leading-tight ${
                variant === 'sidebar' ? 'text-xs' :
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {item.label}
              </div>

              {/* 🆕 Subtexto con información adicional */}
              {item.subtext && (
                <div className={`text-gray-400 mt-1 leading-tight ${
                  variant === 'sidebar' ? 'text-xs' : 'text-xs'
                }`}>
                  {item.subtext}
                </div>
              )}
            </div>
            
            {/* Progress indicator for relevant stats */}
            {(item.label.includes('Caducan') && typeof item.value === 'number' && item.value > 0) && (
              <div className="h-1 bg-gray-100">
                <div className="h-full bg-amber-400 w-1/3"></div>
              </div>
            )}
            
            {/* 🆕 Progress indicator para ahorro */}
            {item.label.includes('Ahorrado') && stats.totalValue && (
              <div className="h-1 bg-gray-100">
                <div 
                  className="h-full bg-green-400" 
                  style={{ 
                    width: `${Math.min((parseFloat(stats.savedMoney.replace(/[€,]/g, '')) / stats.totalValue) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
