// features/dashboard/components/StatsGrid.tsx

import React from 'react';
import { Package, AlertTriangle, DollarSign, Star } from 'lucide-react';
import { formatPrice, formatPoints } from '../../../shared/utils/formatters';

interface StatsGridProps {
  stats: {
    total: number;
    expiringSoon: number;
    expired: number;
    totalConsumed: number;
    totalWasted: number;
  };
  userStats: {
    totalSaved: number;
    points: number;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, userStats }) => {
  const statItems = [
    {
      icon: Package,
      value: stats.total,
      label: 'Productos activos',
      color: 'blue',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600'
    },
    {
      icon: AlertTriangle,
      value: stats.expiringSoon,
      label: 'Vencen pronto',
      color: 'orange',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-600'
    },
    {
      icon: DollarSign,
      value: formatPrice(userStats.totalSaved),
      label: 'Ahorrado',
      color: 'green',
      borderColor: 'border-green-500',
      iconColor: 'text-green-600'
    },
    {
      icon: Star,
      value: formatPoints(userStats.points),
      label: 'Puntos',
      color: 'purple',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 text-center border-l-4 ${item.borderColor} hover:shadow-lg transition-shadow`}
          >
            <Icon className={`w-8 h-8 ${item.iconColor} mx-auto mb-2`} />
            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
            <p className="text-gray-600">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
