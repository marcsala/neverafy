import React from 'react';
import { DollarSign, Flame, Leaf } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: 'green' | 'blue' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className={`
      min-w-[80px] h-[70px] p-3 rounded-xl border
      ${colorClasses[color] || colorClasses.blue}
      flex flex-col items-center justify-center
    `}>
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs font-bold text-center">{value}</div>
      <div className="text-xs opacity-75 text-center">{label}</div>
    </div>
  );
};

interface QuickStatsProps {
  userStats: {
    totalSaved?: number;
    streak?: number;
    co2Saved?: number;
  };
  totalProducts: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ 
  userStats, 
  totalProducts 
}) => (
  <section className="px-4 py-3">
    <div className="flex gap-3 overflow-x-auto pb-2">
      <StatCard 
        icon={<DollarSign size={16} />}
        value={`${userStats.totalSaved || 0}€`}
        label="Ahorrado"
        color="green"
      />
      <StatCard 
        icon="🥬"
        value={totalProducts}
        label="Productos"
        color="blue"
      />
      <StatCard 
        icon={<Flame size={16} />}
        value={`${userStats.streak || 0} días`}
        label="Racha"
        color="orange"
      />
      <StatCard 
        icon={<Leaf size={16} />}
        value={`${userStats.co2Saved || 0}kg`}
        label="CO₂ evitado"
        color="purple"
      />
    </div>
  </section>
);