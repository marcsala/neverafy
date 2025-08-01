// ==============================================
// 🍋 SIMPLE PREMIUM CHECK
// ==============================================

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabase';
import { supabase } from '../config/supabase';

interface SimpleSubscription {
  isPremium: boolean;
  planType: 'monthly' | 'yearly' | null;
  isLoading: boolean;
}

export const useSimplePremium = (): SimpleSubscription => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [planType, setPlanType] = useState<'monthly' | 'yearly' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user || !isAuthenticated) {
        setIsPremium(false);
        setPlanType(null);
        setIsLoading(false);
        return;
      }

      try {
        // Buscar en user_profiles si tiene suscripción activa
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_status, plan_type')
          .eq('user_id', user.id)
          .single();

        const isActive = profile?.subscription_status === 'active';
        setIsPremium(isActive);
        setPlanType(isActive ? profile.plan_type : null);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
        setPlanType(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user?.id, isAuthenticated]);

  return { isPremium, planType, isLoading };
};

// Hook para mostrar el modal de upgrade cuando sea necesario
export const usePremiumGate = () => {
  const { isPremium } = useSimplePremium();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const requirePremium = (feature: string = 'esta función') => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  return {
    isPremium,
    showUpgradeModal,
    setShowUpgradeModal,
    requirePremium
  };
};
