// features/achievements/components/AchievementNotification.tsx

import React, { useState, useEffect } from 'react';
import { X, Star, Trophy } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  isVisible,
  onClose,
  autoHideDuration = 5000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      setIsAnimating(true);
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, autoHideDuration, onClose]);

  useEffect(() => {
    if (!isVisible) {
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible || !achievement) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div 
        className={`transform transition-all duration-500 ease-out ${
          isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-300">
          {/* Celebration header */}
          <div className="bg-yellow-300 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-800" />
              <span className="font-bold text-yellow-800 text-sm">
                ¡LOGRO DESBLOQUEADO!
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-yellow-800 hover:text-yellow-900 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 text-6xl opacity-20">
              🎉
            </div>
            
            <div className="relative">
              <div className="flex items-start gap-3">
                <div className="text-4xl bg-white bg-opacity-20 rounded-full p-2">
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {achievement.name}
                  </h3>
                  <p className="text-yellow-100 text-sm mb-2">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-200" />
                    <span className="font-medium text-yellow-200">
                      +{achievement.points} puntos ganados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar animation */}
            <div className="mt-3 bg-white bg-opacity-20 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-2000 ease-out"
                style={{ 
                  width: isAnimating ? '100%' : '0%',
                  transitionDelay: '0.5s'
                }}
              />
            </div>
          </div>

          {/* Sparkle effects */}
          {isAnimating && (
            <>
              <div className="absolute top-2 left-2 text-yellow-200 animate-ping text-xs">✨</div>
              <div className="absolute top-4 right-8 text-yellow-200 animate-ping text-xs delay-100">⭐</div>
              <div className="absolute bottom-4 left-8 text-yellow-200 animate-ping text-xs delay-200">💫</div>
              <div className="absolute bottom-2 right-4 text-yellow-200 animate-ping text-xs delay-300">🌟</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
