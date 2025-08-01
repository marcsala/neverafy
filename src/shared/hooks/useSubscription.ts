// ==============================================
// 🍋 HOOK PARA GESTIÓN DE SUSCRIPCIONES
// ==============================================
// Hook para manejar el estado de suscripción del usuario

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabase';
import { lemonSqueezyClient, hasActiveSubscription, Subscription } from '../../services/payments/lemonSqueezyClient';
import { supabase } from '../config/supabase';

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<boolean>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener información de suscripción del usuario
  const fetchSubscription = async () => {
    if (!user || !isAuthenticated) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Buscar subscription_id en la base de datos de Supabase
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_id, subscription_status, plan_type')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(`Error fetching profile: ${profileError.message}`);
      }

      // 2. Si tiene subscription_id, obtener detalles de LemonSqueezy
      if (profile?.subscription_id) {
        const subscriptionData = await lemonSqueezyClient.getSubscription(profile.subscription_id);
        
        if (subscriptionData) {
          setSubscription(subscriptionData);
          
          // 3. Actualizar estado local en Supabase si hay diferencias
          if (subscriptionData.status !== profile.subscription_status) {
            await supabase
              .from('user_profiles')
              .update({
                subscription_status: subscriptionData.status,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);
          }
        } else {
          // Subscription no encontrada en LemonSqueezy, limpiar base local
          await supabase
            .from('user_profiles')
            .update({
              subscription_id: null,
              subscription_status: null,
              plan_type: null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);
          
          setSubscription(null);
        }
      } else {
        setSubscription(null);
      }
      
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar información de suscripción
  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  // Cancelar suscripción
  const cancelSubscription = async (): Promise<boolean> => {
    if (!subscription || !user) return false;

    try {
      const success = await lemonSqueezyClient.cancelSubscription(subscription.id);
      
      if (success) {
        // Actualizar estado local
        await refreshSubscription();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  };

  // Cargar suscripción al montar el componente o cambiar usuario
  useEffect(() => {
    fetchSubscription();
  }, [user?.id, isAuthenticated]);

  // Determinar si el usuario es premium
  const isPremium = hasActiveSubscription(subscription);

  return {
    subscription,
    isPremium,
    isLoading,
    error,
    refreshSubscription,
    cancelSubscription,
  };
};

// ==============================================
// 🎯 HOOK PARA PROCESOS DE CHECKOUT
// ==============================================

interface UseCheckoutReturn {
  startCheckout: (planType: 'monthly' | 'yearly') => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export const useCheckout = (): UseCheckoutReturn => {
  const { user } = useSupabaseAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      setError('Debes estar autenticado para suscribirte');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const { createCheckout } = await import('../../services/payments/lemonSqueezyClient');
      const { PREMIUM_PLANS } = await import('../../services/payments/lemonSqueezyConfig');
      
      const variantId = planType === 'monthly' ? PREMIUM_PLANS.MONTHLY : PREMIUM_PLANS.YEARLY;
      const userEmail = user.email || '';

      const checkout = await createCheckout({
        variantId,
        userId: user.id,
        userEmail,
        customData: {
          plan_type: planType,
          source_page: 'premium_modal',
        },
      });

      // Redirigir al checkout de LemonSqueezy
      window.location.href = checkout.checkoutUrl;
      
    } catch (err) {
      console.error('Error starting checkout:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar el checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    startCheckout,
    isProcessing,
    error,
  };
};

export default useSubscription;
