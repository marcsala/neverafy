// Components
export { default as AchievementsView } from './components/AchievementsView';
export { default as AchievementCard } from './components/AchievementCard';
export { default as NextChallenges } from './components/NextChallenges';

// Hooks
export { useAchievements } from './hooks/useAchievements';

// Types
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface UserStats {
  totalSaved: number;
  recipesGenerated: number;
  streak: number;
  co2Saved: number;
  ocrUsed: number;
}