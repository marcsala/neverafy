import { useMemo } from 'react';

interface UserStats {
  totalSaved: number;
  recipesGenerated: number;
  streak: number;
  co2Saved: number;
  ocrUsed: number;
}

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

interface UseAchievementsProps {
  achievements: Achievement[];
  products: Product[];
  userStats: UserStats;
}

interface UseAchievementsReturn {
  achievementsWithStatus: Array<Achievement & { isUnlocked: boolean }>;
  nextChallenges: Array<{
    id: string;
    emoji: string;
    title: string;
    progress: string;
  }>;
  totalUnlocked: number;
  totalPoints: number;
}

export const useAchievements = ({ 
  achievements, 
  products, 
  userStats 
}: UseAchievementsProps): UseAchievementsReturn => {
  
  // Lógica para determinar si un logro está desbloqueado
  const checkAchievementUnlocked = (achievementId: number): boolean => {
    switch(achievementId) {
      case 1: return products.length > 0;
      case 2: return userStats.totalSaved >= 10;
      case 3: return userStats.recipesGenerated >= 5;
      case 4: return userStats.streak >= 7;
      case 5: return userStats.co2Saved >= 50;
      case 6: return userStats.ocrUsed >= 10;
      case 7: return userStats.recipesGenerated >= 20;
      default: return false;
    }
  };

  // Calcular achievements con estado de desbloqueo
  const achievementsWithStatus = useMemo(() => {
    return achievements.map(achievement => ({
      ...achievement,
      isUnlocked: checkAchievementUnlocked(achievement.id)
    }));
  }, [achievements, products.length, userStats]);

  // Calcular estadísticas
  const totalUnlocked = useMemo(() => {
    return achievementsWithStatus.filter(a => a.isUnlocked).length;
  }, [achievementsWithStatus]);

  const totalPoints = useMemo(() => {
    return achievementsWithStatus
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + a.points, 0);
  }, [achievementsWithStatus]);

  // Próximos desafíos
  const nextChallenges = useMemo(() => [
    {
      id: 'ocr',
      emoji: '📸',
      title: 'Usa OCR 5 veces más',
      progress: `${userStats.ocrUsed}/10`
    },
    {
      id: 'recipes',
      emoji: '🍳',
      title: 'Genera 15 recetas más',
      progress: `${userStats.recipesGenerated}/20`
    },
    {
      id: 'savings',
      emoji: '💰',
      title: 'Ahorra 40€ más',
      progress: `${userStats.totalSaved.toFixed(1)}/50€`
    }
  ], [userStats]);

  return {
    achievementsWithStatus,
    nextChallenges,
    totalUnlocked,
    totalPoints
  };
};

export default useAchievements;