// features/achievements/components/ProgressOverview.tsx

import React from 'react';
import { Trophy, Star, Flame, Target, TrendingUp } from 'lucide-react';
import { formatPoints } from '../../../shared/utils/formatters';

interface UserStats {
  points: number;
  level: number;
  streak: number;
  totalSaved: number;
  co2Saved: number;
  ocrUsed: number;
  recipesGenerated: number;
}

interface ProgressOverviewProps {
  userStats: UserStats;
  unlockedCount: number;
  totalAchievements: number;
  nextLevelPoints: number;
  currentLevelPoints: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  userStats,
  unlockedCount,
  totalAchievements,
  nextLevelPoints,
  currentLevelPoints
}) => {
  const achievementPercentage = (unlockedCount / totalAchievements) * 100;
  const levelProgress = ((userStats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const overviewStats = [
    {
      icon: Trophy,
      label: 'Logros',
      value: `${unlockedCount}/${totalAchievements}`,
      percentage: achievementPercentage,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500'
    },
    {
      icon: Star,
      label: 'Puntos',
      value: formatPoints(userStats.points),
      percentage: levelProgress,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500'
    },
    {
      icon: Flame,
      label: 'Racha',
      value: `${userStats.streak} días`,
      percentage: Math.min((userStats.streak / 30) * 100, 100),
      color: 'text-orange-600',
      bgColor: 'bg-orange-500'
    },
    {
      icon: Target,
      label: 'Nivel',
      value: userStats.level,
      percentage: levelProgress,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tu Progreso</h2>
          <p className="text-gray-600">Logros y estadísticas de gamificación</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${stat.bgColor}`}
                  style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(stat.percentage)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏆</div>
            <div>
              <h3 className="font-bold text-gray-800">Nivel {userStats.level}</h3>
              <p className="text-sm text-gray-600">
                {nextLevelPoints - userStats.points} puntos para el siguiente nivel
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {userStats.points - currentLevelPoints}/{nextLevelPoints - currentLevelPoints}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(levelProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {userStats.totalSaved.toFixed(1)}€
          </div>
          <div className="text-sm text-gray-600">Dinero ahorrado</div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {userStats.co2Saved.toFixed(1)}kg
          </div>
          <div className="text-sm text-gray-600">CO2 ahorrado</div>
        </div>
        
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {userStats.ocrUsed + userStats.recipesGenerated}
          </div>
          <div className="text-sm text-gray-600">IA usada</div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">
            {getMotivationalMessage(userStats, achievementPercentage)}
          </span>
        </div>
      </div>
    </div>
  );
};

const getMotivationalMessage = (userStats: UserStats, achievementPercentage: number): string => {
  if (achievementPercentage === 100) {
    return "¡Increíble! Has desbloqueado todos los logros. Eres un maestro del ahorro.";
  }
  
  if (achievementPercentage >= 80) {
    return "¡Excelente progreso! Estás muy cerca de completar todos los logros.";
  }
  
  if (userStats.streak >= 7) {
    return `¡Impresionante racha de ${userStats.streak} días! Sigue así para mantener el momentum.`;
  }
  
  if (userStats.totalSaved >= 20) {
    return `Has ahorrado ${userStats.totalSaved.toFixed(1)}€. ¡Tu bolsillo y el planeta te lo agradecen!`;
  }
  
  if (userStats.level >= 3) {
    return `Nivel ${userStats.level} alcanzado. Tu gestión de alimentos está mejorando notablemente.`;
  }
  
  return "¡Buen comienzo! Cada pequeña acción cuenta para reducir el desperdicio alimentario.";
};

export default ProgressOverview;
