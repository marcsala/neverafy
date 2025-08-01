// ==============================================
// 🍋 LEMONSQUEEZY API CLIENT  
// ==============================================
// Cliente para interactuar con la API de LemonSqueezy

import { lemonSqueezyConfig, CheckoutData, Subscription, PREMIUM_PLANS } from './lemonSqueezyConfig';

class LemonSqueezyClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = lemonSqueezyConfig.apiKey;
    this.baseUrl = lemonSqueezyConfig.baseUrl;
  }

  /**
   * Crear un checkout session para suscripción premium
   */
  async createCheckout(data: CheckoutData): Promise<{ checkoutUrl: string; checkoutId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              product_options: {
                redirect_url: `${window.location.origin}/dashboard?upgrade=success`,
                receipt_link_url: `${window.location.origin}/dashboard?receipt=true`,
                receipt_thank_you_note: '¡Gracias por upgradearte a Neverafy Premium! 🎉',
              },
              checkout_options: {
                embed: false,
                media: true,
                logo: true,
              },
              checkout_data: {
                email: data.userEmail,
                custom: {
                  user_id: data.userId,
                  source: 'neverafy_app',
                  ...data.customData,
                },
              },
              preview: true, // Para testing, cambiar a false en producción
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: lemonSqueezyConfig.storeId,
                },
              },
              variant: {
                data: {
                  type: 'variants',
                  id: data.variantId,
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`LemonSqueezy API Error: ${error.errors?.[0]?.detail || 'Unknown error'}`);
      }

      const result = await response.json();
      
      return {
        checkoutUrl: result.data.attributes.url,
        checkoutId: result.data.id,
      };
    } catch (error) {
      console.error('Error creating LemonSqueezy checkout:', error);
      throw error;
    }
  }

  /**
   * Obtener información de una suscripción
   */
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/subscriptions/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch subscription: ${response.status}`);
      }

      const result = await response.json();
      const sub = result.data;

      return {
        id: sub.id,
        status: sub.attributes.status,
        plan: sub.attributes.product_name,
        currentPeriodEnd: sub.attributes.renews_at,
        userId: sub.attributes.custom_data?.user_id || '',
      };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  /**
   * Cancelar una suscripción
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'subscriptions',
            id: subscriptionId,
            attributes: {
              cancelled: true,
            },
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  /**
   * Obtener URL de portal del cliente
   */
  async getCustomerPortalUrl(customerId: string): Promise<string | null> {
    try {
      // LemonSqueezy no tiene un portal unificado como Stripe,
      // pero puedes redirigir a la página de gestión de suscripción
      return `https://app.lemonsqueezy.com/billing`;
    } catch (error) {
      console.error('Error getting customer portal URL:', error);
      return null;
    }
  }
}

// Instancia singleton del cliente
export const lemonSqueezyClient = new LemonSqueezyClient();

// ==============================================
// 🎯 HELPER FUNCTIONS
// ==============================================

/**
 * Iniciar proceso de checkout para plan premium mensual
 */
export const startMonthlyCheckout = async (userId: string, userEmail: string) => {
  return lemonSqueezyClient.createCheckout({
    variantId: PREMIUM_PLANS.MONTHLY,
    userId,
    userEmail,
    customData: {
      plan_type: 'monthly',
      source_page: 'premium_upgrade',
    },
  });
};

/**
 * Iniciar proceso de checkout para plan premium anual
 */
export const startYearlyCheckout = async (userId: string, userEmail: string) => {
  return lemonSqueezyClient.createCheckout({
    variantId: PREMIUM_PLANS.YEARLY,
    userId,
    userEmail,
    customData: {
      plan_type: 'yearly',
      source_page: 'premium_upgrade',
    },
  });
};

/**
 * Verificar si un usuario tiene suscripción activa
 */
export const hasActiveSubscription = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  
  return subscription.status === 'active' && 
         new Date(subscription.currentPeriodEnd) > new Date();
};

export default lemonSqueezyClient;
