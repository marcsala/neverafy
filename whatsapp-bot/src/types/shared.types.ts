// Tipos reutilizados de la web de Neverafy
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: string;
  expiryDate: string;
  daysLeft: number;
  price?: number;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  category: string;
  expiry_date: string;
  quantity: string | number;
  price?: number;
  source: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Tipos específicos del bot de WhatsApp
export interface WhatsAppUser {
  id: string;
  phone_number: string;
  user_id: string | null; // Referencia a auth.users si existe
  subscription_tier: 'free' | 'premium';
  is_active: boolean;
  preferred_alert_time?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationContext {
  id: string;
  user_id: string;
  last_intent?: string;
  pending_action?: string;
  context_data?: any;
  expires_at: string | Date; // Allow both string and Date
  created_at: string;
}

export type LimitAction = 'add_product' | 'remove_product' | 'ai_request' | 'ai_query' | 'daily_message' | 'recipe_request';

export interface ParsedProduct {
  name: string | null;
  quantity: string | null;
  expiryDate: string | null;
  price: number | null;
}

export interface UserStats {
  totalProducts: number;
  urgentProducts: number;
  totalValue: number;
  topCategory: string;
  averageDaysLeft: number;
}
