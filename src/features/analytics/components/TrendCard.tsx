import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TrendCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'orange' | 'green' | 'purple';
  className?: string;
}

const TrendCard: React.FC<TrendCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  color,
  className = '' 
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        description: 'text-blue-600'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        description: 'text-orange-600'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        title: 'text-green-800',
        description: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        title: 'text-purple-800',
        description: 'text-purple-600'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const colors = getColorClasses(color);

  return (
    <div className={`text-center p-4 ${colors.bg} rounded-lg ${className}`}>
      <Icon className={`w-8 h-8 ${colors.icon} mx-auto mb-2`} />
      <h4 className={`font-bold ${colors.title} mb-1`}>{title}</h4>
      <p className={`text-lg font-semibold ${colors.title} mb-1`}>{value}</p>
      <p className={`text-sm ${colors.description}`}>{description}</p>
    </div>
  );
};

export default TrendCard;