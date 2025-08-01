// ==============================================
// 🍋 LEMONSQUEEZY CLIENT CONFIGURATION
// ==============================================
// Configuración del cliente para LemonSqueezy API

export interface LemonSqueezyConfig {
  apiKey: string;
  storeId: string;
  baseUrl: string;
}

export interface CheckoutData {
  variantId: string;
  userId: string;
  userEmail: string;
  customData?: Record<string, any>;
}

export interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'expired' | 'unpaid' | 'past_due';
  plan: string;
  currentPeriodEnd: string;
  userId: string;
}

// Configuración del cliente LemonSqueezy
export const lemonSqueezyConfig: LemonSqueezyConfig = {
  apiKey: import.meta.env.LEMONSQUEEZY_API_KEY || '',
  storeId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || '',
  baseUrl: import.meta.env.VITE_LEMONSQUEEZY_BASE_URL || 'https://api.lemonsqueezy.com',
};

// Product IDs para los planes premium
export const PREMIUM_PLANS = {
  MONTHLY: import.meta.env.VITE_LEMONSQUEEZY_PREMIUM_MONTHLY_ID || '',
  YEARLY: import.meta.env.VITE_LEMONSQUEEZY_PREMIUM_YEARLY_ID || '',
} as const;

// Estados de suscripción
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  UNPAID: 'unpaid',
  PAST_DUE: 'past_due',
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
