import { useMemo } from 'react';

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

interface UseAnalyticsProps {
  stats: Stats;
  userStats: UserStats;
}

interface UseAnalyticsReturn {
  monthlyStats: Array<{ label: string; value: string | number; color?: string }>;
  environmentalStats: Array<{ label: string; value: string; color?: string }>;
  efficiency: number;
  waterSaved: number;
  carEquivalent: number;
  trends: {
    bestCategory: string;
    averageConsumption: string;
    monthlyGoal: string;
    currentProgress: number;
  };
}

export const useAnalytics = ({ stats, userStats }: UseAnalyticsProps): UseAnalyticsReturn => {
  
  // Calcular eficiencia
  const efficiency = useMemo(() => {
    const total = stats.totalConsumed + stats.totalWasted;
    return total > 0 ? Math.round((stats.totalConsumed / total) * 100) : 0;
  }, [stats.totalConsumed, stats.totalWasted]);

  // Estadísticas mensuales
  const monthlyStats = useMemo(() => [
    { label: 'Productos consumidos', value: stats.totalConsumed, color: 'green' },
    { label: 'Productos desperdiciados', value: stats.totalWasted, color: 'red' },
    { label: 'Eficiencia', value: `${efficiency}%`, color: 'blue' },
    { label: 'Análisis OCR realizados', value: userStats.ocrUsed, color: 'purple' },
    { label: 'Recetas generadas', value: userStats.recipesGenerated, color: 'orange' }
  ], [stats, userStats, efficiency]);

  // Cálculos ambientales
  const waterSaved = useMemo(() => userStats.co2Saved * 1.5, [userStats.co2Saved]);
  const carEquivalent = useMemo(() => Math.round(userStats.co2Saved / 2.3), [userStats.co2Saved]);

  // Estadísticas ambientales
  const environmentalStats = useMemo(() => [
    { label: 'CO2 ahorrado', value: `${userStats.co2Saved.toFixed(1)} kg`, color: 'green' },
    { label: 'Agua ahorrada', value: `${waterSaved.toFixed(0)} litros`, color: 'blue' },
    { label: 'Equivale a', value: `${carEquivalent} km en coche`, color: 'purple' },
    { label: 'Dinero ahorrado', value: `${userStats.totalSaved.toFixed(2)}€`, color: 'green' }
  ], [userStats.co2Saved, userStats.totalSaved, waterSaved, carEquivalent]);

  // Tendencias (datos mockup por ahora)
  const trends = useMemo(() => ({
    bestCategory: 'Frutas (85% consumidas)',
    averageConsumption: '2.3 días antes vencimiento',
    monthlyGoal: '80% eficiencia (78% actual)',
    currentProgress: efficiency
  }), [efficiency]);

  return {
    monthlyStats,
    environmentalStats,
    efficiency,
    waterSaved,
    carEquivalent,
    trends
  };
};

export default useAnalytics;