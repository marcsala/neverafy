import React from 'react';
import AchievementCard from './AchievementCard';
import NextChallenges from './NextChallenges';
import { useAchievements } from '../hooks/useAchievements';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface Product {
  id: string;
  // otras propiedades del producto
}

interface UserStats {
  totalSaved: number;
  recipesGenerated: number;
  streak: number;
  co2Saved: number;
  ocrUsed: number;
}

interface AchievementsViewProps {
  achievements: Achievement[];
  products: Product[];
  userStats: UserStats;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ 
  achievements, 
  products, 
  userStats 
}) => {
  const { 
    achievementsWithStatus, 
    nextChallenges, 
    totalUnlocked, 
    totalPoints 
  } = useAchievements({ achievements, products, userStats });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">🏆 Logros y Desafíos</h3>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalUnlocked}</span>/{achievements.length} desbloqueados
            <span className="ml-4 font-medium text-purple-600">{totalPoints} puntos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievementsWithStatus.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={achievement.isUnlocked}
            />
          ))}
        </div>

        <NextChallenges challenges={nextChallenges} />
      </div>
    </div>
  );
};

export default AchievementsView;