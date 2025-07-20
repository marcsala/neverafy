// Components
export { default as AnalyticsView } from './components/AnalyticsView';
export { default as StatsCard } from './components/StatsCard';
export { default as TrendCard } from './components/TrendCard';
export { default as PremiumUpgrade } from './components/PremiumUpgrade';
export { default as PremiumAnalytics } from './components/PremiumAnalytics';

// Hooks
export { useAnalytics } from './hooks/useAnalytics';

// Types
export interface Stats {
  totalConsumed: number;
  totalWasted: number;
}

export interface UserStats {
  ocrUsed: number;
  recipesGenerated: number;
  co2Saved: number;
  totalSaved: number;
  streak: number;
}