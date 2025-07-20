import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isUnlocked ? 'border-green-200 bg-green-50 shadow-md' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
          <p className="text-sm text-gray-600">{achievement.description}</p>
          <p className="text-xs text-purple-600 font-medium">+{achievement.points} puntos</p>
        </div>
        {isUnlocked ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-600">¡Desbloqueado!</span>
          </div>
        ) : (
          <div className="text-gray-400">
            <Clock className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;