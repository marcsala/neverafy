// features/dashboard/components/ProgressSection.tsx

import React from 'react';
import { Flame, Leaf, Camera, ChefHat } from 'lucide-react';
import { formatWeight, formatLevel } from '@/shared/utils/formatters';
import { LEVEL_THRESHOLDS, FREEMIUM_LIMITS } from '@/shared/utils/constants';

interface ProgressSectionProps {
  userStats: {
    level: number;
    points: number;
    streak: number;
    co2Saved: number;
    ocrUsed: number;
    recipesGenerated: number;
  };
  isPremium: boolean;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ userStats, isPremium }) => {
  // Calcular progreso del nivel actual
  const currentLevelThreshold = LEVEL_THRESHOLDS[userStats.level - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[userStats.level] || currentLevelThreshold + 1000;
  const pointsInCurrentLevel = userStats.points - currentLevelThreshold;
  const pointsNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progressPercentage = (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;

  const progressItems = [
    {
      icon: Flame,
      value: `${userStats.streak} días`,
      label: 'Racha',
      color: 'text-orange-500'
    },
    {
      icon: Leaf,
      value: formatWeight(userStats.co2Saved),
      label: 'CO2 ahorrado',
      color: 'text-green-500'
    },
    {
      icon: Camera,
      value: isPremium ? `${userStats.ocrUsed}/∞` : `${userStats.ocrUsed}/${FREEMIUM_LIMITS.OCR_MONTHLY}`,
      label: 'OCR usado',
      color: 'text-blue-500'
    },
    {
      icon: ChefHat,
      value: isPremium ? `${userStats.recipesGenerated}/∞` : `${userStats.recipesGenerated}/${FREEMIUM_LIMITS.RECIPES_MONTHLY}`,
      label: 'Recetas IA',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Progreso 🌟</h3>
      
      {/* Barra de progreso del nivel */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-2xl">🏆</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">{formatLevel(userStats.level)}</span>
            <span className="text-sm text-gray-600">
              {pointsInCurrentLevel}/{pointsNeededForNextLevel} puntos
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          {userStats.level < LEVEL_THRESHOLDS.length && (
            <p className="text-xs text-gray-500 mt-1">
              {nextLevelThreshold - userStats.points} puntos para el siguiente nivel
            </p>
          )}
        </div>
      </div>

      {/* Grid de estadísticas detalladas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {progressItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Icon className={`w-6 h-6 ${item.color} mx-auto mb-1`} />
              <p className="text-sm font-medium text-gray-800">{item.value}</p>
              <p className="text-xs text-gray-600">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSection;
