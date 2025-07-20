import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  color?: 'green' | 'red' | 'blue' | 'purple' | 'orange';
}

interface StatsCardProps {
  title: string;
  icon: string;
  stats: StatItem[];
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, icon, stats, className = '' }) => {
  const getColorClass = (color: string = 'gray') => {
    const colorMap = {
      green: 'text-green-600',
      red: 'text-red-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      gray: 'text-gray-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-700">{stat.label}:</span>
            <span className={`font-bold ${getColorClass(stat.color)}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;