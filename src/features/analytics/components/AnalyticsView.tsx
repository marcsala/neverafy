import React from 'react';
import { TrendingUp, Clock, Target } from 'lucide-react';
import StatsCard from './StatsCard';
import TrendCard from './TrendCard';
import PremiumUpgrade from './PremiumUpgrade';
import PremiumAnalytics from './PremiumAnalytics';
import { useAnalytics } from '../hooks/useAnalytics';

interface Stats {
  totalConsumed: number;
  totalWasted: number;
}

interface UserStats {
  ocrUsed: number;
  recipesGenerated: number;
  co2Saved: number;
  totalSaved: number;
  streak: number;
}

interface AnalyticsViewProps {
  stats: Stats;
  userStats: UserStats;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  stats, 
  userStats, 
  isPremium, 
  setIsPremium 
}) => {
  const { 
    monthlyStats, 
    environmentalStats, 
    trends 
  } = useAnalytics({ stats, userStats });

  const trendData = [
    {
      icon: TrendingUp,
      title: 'Mejor Categoría',
      value: trends.bestCategory.split(' ')[0],
      description: trends.bestCategory,
      color: 'blue' as const
    },
    {
      icon: Clock,
      title: 'Promedio Consumo',
      value: '2.3 días',
      description: trends.averageConsumption,
      color: 'orange' as const
    },
    {
      icon: Target,
      title: 'Meta Mensual',
      value: `${trends.currentProgress}%`,
      description: trends.monthlyGoal,
      color: 'green' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Resumen y Impacto Ambiental */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Resumen Mensual"
          icon="📊"
          stats={monthlyStats}
        />
        <StatsCard
          title="Impacto Ambiental"
          icon="🌱"
          stats={environmentalStats}
        />
      </div>

      {/* Tendencias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendData.map((trend, index) => (
            <TrendCard
              key={index}
              icon={trend.icon}
              title={trend.title}
              value={trend.value}
              description={trend.description}
              color={trend.color}
            />
          ))}
        </div>
      </div>

      {/* Premium Content */}
      {isPremium ? (
        <PremiumAnalytics userStats={userStats} />
      ) : (
        <PremiumUpgrade onUpgrade={() => setIsPremium(true)} />
      )}
    </div>
  );
};

export default AnalyticsView;