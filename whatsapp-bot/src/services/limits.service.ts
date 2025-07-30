// src/services/limits.service.ts
import { supabase } from '../config/supabase';
import { WhatsAppService } from './whatsapp.service';
import { MetricsService } from './metrics.service';
import { UsersService } from './users.service';

export type LimitAction = 'add_product' | 'ai_query' | 'daily_message' | 'remove_product' | 'recipe_request';

export interface LimitResult {
  allowed: boolean;
  remaining: number;
  limit?: number;
  usage?: number;
  resetTime?: Date;
}

export interface UserUsage {
  daily_messages: number;
  weekly_products: number;
  monthly_ai_queries: number;
  products_stored: number;
  last_reset_daily: Date;
  last_reset_weekly: Date;
  last_reset_monthly: Date;
}

export class LimitsService {
  private readonly FREE_LIMITS = {
    daily_messages: 20,
    weekly_products: 15,
    monthly_ai_queries: 50,
    max_products_stored: 30,
    recipe_requests_daily: 5
  };

  constructor(
    private whatsappService: WhatsAppService,
    private metricsService: MetricsService,
    private usersService: UsersService
  ) {}

  async checkAndEnforceLimit(userId: string, action: LimitAction): Promise<LimitResult> {
    const user = await this.getUserSubscription(userId);
    
    if (user.subscription_tier === 'premium') {
      await this.incrementUsage(userId, action);
      return { allowed: true, remaining: -1 }; // Unlimited
    }

    const usage = await this.getCurrentUsage(userId, action);
    const limit = this.getLimitForAction(action);
    
    if (usage >= limit) {
      await this.triggerUpsellFlow(userId, action);
      return { 
        allowed: false, 
        remaining: 0, 
        limit, 
        usage,
        resetTime: this.getNextResetTime(action)
      };
    }

    await this.incrementUsage(userId, action);
    return { 
      allowed: true, 
      remaining: limit - usage - 1, 
      limit, 
      usage: usage + 1 
    };
  }

  private async getCurrentUsage(userId: string, action: LimitAction): Promise<number> {
    const { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!usage) {
      await this.createUsageRecord(userId);
      return 0;
    }

    // Check if we need to reset counters
    await this.resetUsageIfNeeded(userId, usage);

    switch (action) {
      case 'daily_message':
        return usage.daily_messages || 0;
      case 'add_product':
      case 'remove_product':
        return usage.weekly_products || 0;
      case 'ai_query':
      case 'recipe_request':
        return usage.monthly_ai_queries || 0;
      default:
        return 0;
    }
  }

  private async incrementUsage(userId: string, action: LimitAction): Promise<void> {
    const field = this.getUsageField(action);
    
    await supabase.rpc('increment_usage', {
      user_id: userId,
      field_name: field
    });

    // Track para analytics
    await this.metricsService.trackUsage(userId, action);
  }

  private async triggerUpsellFlow(userId: string, action: LimitAction): Promise<void> {
    const user = await this.usersService.getWhatsAppUser(userId);
    if (!user) return;

    const message = this.getUpsellMessage(action, userId);
    
    await this.whatsappService.sendMessage(user.phone_number, message);
    
    // Trackear oportunidad de upsell
    await this.metricsService.trackUpsellOpportunity(userId, action);
    
    // Programar follow-up si no hay respuesta en 24h
    await this.scheduleFollowUp(userId, action);
  }

  private getUpsellMessage(action: LimitAction, userId: string): string {
    const userCode = this.generateUserCode(userId);
    const messages = {
      add_product: `📦 *Has alcanzado tu límite de productos gratuitos* (${this.FREE_LIMITS.max_products_stored}).

🚀 *Upgrade a Premium por €4.99/mes:*
• ✅ Productos ilimitados
• 🎯 Alertas personalizadas  
• 👨‍🍳 Recetas IA detalladas
• 📊 Analytics avanzados
• 🔔 Alertas por categorías

💳 *Activar Premium:*
Bizum €4.99 a: *123456789*
Concepto: *PREMIUM-${userCode}*

⚡ Se activa automáticamente`,

      ai_query: `🤖 *Has usado tus consultas IA gratuitas del mes* (${this.FREE_LIMITS.monthly_ai_queries}).

🧠 *Premium incluye:*
• 🚀 Consultas IA ilimitadas
• 🍽️ Recetas personalizadas avanzadas
• 💡 Sugerencias inteligentes por contexto
• 📈 Análisis de tendencias alimentarias
• 🎯 Recomendaciones por preferencias

💳 Solo €4.99/mes - Bizum: *123456789*
Concepto: *PREMIUM-${userCode}*`,

      daily_message: `💬 *Límite de mensajes diarios alcanzado* (${this.FREE_LIMITS.daily_messages}).

⭐ *Con Premium NUNCA tendrás límites:*
• 📱 Mensajes ilimitados
• 🤖 IA siempre disponible
• ⚡ Respuestas instantáneas
• 🎯 Funciones exclusivas

💳 Upgrade: Bizum €4.99 a *123456789*
Concepto: *PREMIUM-${userCode}*`,

      recipe_request: `👨‍🍳 *Límite de recetas diarias alcanzado* (${this.FREE_LIMITS.recipe_requests_daily}).

🍽️ *Premium desbloquea:*
• 🚀 Recetas ilimitadas
• 👥 Recetas para toda la familia
• 🌍 Cocina internacional
• ⏰ Recetas por tiempo disponible
• 🥗 Filtros dietéticos avanzados

💳 Solo €4.99/mes - Concepto: *PREMIUM-${userCode}*`
    };

    return messages[action] || `⭐ *¡Upgrade a Premium por €4.99/mes!*

Desbloquea todas las funciones sin límites:
• 🚀 Todo ilimitado
• 🎯 Funciones premium exclusivas  
• 🤝 Soporte prioritario

Bizum: *123456789* - Concepto: *PREMIUM-${userCode}*`;
  }

  private getLimitForAction(action: LimitAction): number {
    switch (action) {
      case 'daily_message':
        return this.FREE_LIMITS.daily_messages;
      case 'add_product':
      case 'remove_product':
        return this.FREE_LIMITS.weekly_products;
      case 'ai_query':
      case 'recipe_request':
        return this.FREE_LIMITS.monthly_ai_queries;
      default:
        return 0;
    }
  }

  private getUsageField(action: LimitAction): string {
    switch (action) {
      case 'daily_message':
        return 'daily_messages';
      case 'add_product':
      case 'remove_product':
        return 'weekly_products';
      case 'ai_query':
      case 'recipe_request':
        return 'monthly_ai_queries';
      default:
        return 'daily_messages';
    }
  }

  private getNextResetTime(action: LimitAction): Date {
    const now = new Date();
    switch (action) {
      case 'daily_message':
      case 'recipe_request':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
      case 'add_product':
      case 'remove_product':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()));
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek;
      case 'ai_query':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        return nextMonth;
      default:
        const tomorrowDefault = new Date(now);
        tomorrowDefault.setDate(tomorrowDefault.getDate() + 1);
        tomorrowDefault.setHours(0, 0, 0, 0);
        return tomorrowDefault;
    }
  }

  private async resetUsageIfNeeded(userId: string, usage: UserUsage): Promise<void> {
    const now = new Date();
    const updates: any = {};
    
    // Reset daily
    if (this.shouldResetDaily(usage.last_reset_daily, now)) {
      updates.daily_messages = 0;
      updates.last_reset_daily = now.toISOString();
    }
    
    // Reset weekly  
    if (this.shouldResetWeekly(usage.last_reset_weekly, now)) {
      updates.weekly_products = 0;
      updates.last_reset_weekly = now.toISOString();
    }
    
    // Reset monthly
    if (this.shouldResetMonthly(usage.last_reset_monthly, now)) {
      updates.monthly_ai_queries = 0;
      updates.last_reset_monthly = now.toISOString();
    }

    if (Object.keys(updates).length > 0) {
      await supabase
        .from('user_usage')
        .update(updates)
        .eq('user_id', userId);
    }
  }

  private shouldResetDaily(lastReset: Date, now: Date): boolean {
    return !lastReset || now.toDateString() !== new Date(lastReset).toDateString();
  }

  private shouldResetWeekly(lastReset: Date, now: Date): boolean {
    if (!lastReset) return true;
    const lastResetDate = new Date(lastReset);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    return lastResetDate < weekStart;
  }

  private shouldResetMonthly(lastReset: Date, now: Date): boolean {
    if (!lastReset) return true;
    const lastResetDate = new Date(lastReset);
    return lastResetDate.getMonth() !== now.getMonth() || 
           lastResetDate.getFullYear() !== now.getFullYear();
  }

  private async createUsageRecord(userId: string): Promise<void> {
    const now = new Date();
    await supabase
      .from('user_usage')
      .insert({
        user_id: userId,
        daily_messages: 0,
        weekly_products: 0,
        monthly_ai_queries: 0,
        products_stored: 0,
        last_reset_daily: now.toISOString(),
        last_reset_weekly: now.toISOString(),
        last_reset_monthly: now.toISOString()
      });
  }

  private async getUserSubscription(userId: string) {
    const { data } = await supabase
      .from('whatsapp_users')
      .select('subscription_tier, subscription_expires_at')
      .eq('user_id', userId)
      .single();

    return data || { subscription_tier: 'free', subscription_expires_at: null };
  }

  private generateUserCode(userId: string): string {
    // Generar código único de 6 caracteres basado en userId
    return Buffer.from(userId.slice(-8), 'hex').toString('base64').slice(0, 6).toUpperCase();
  }

  private async scheduleFollowUp(userId: string, action: LimitAction): Promise<void> {
    // Programar follow-up en 24h si no hay conversión
    await supabase
      .from('scheduled_messages')
      .insert({
        user_id: userId,
        message_type: 'upsell_followup',
        context_data: { action, attempts: 1 },
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
  }

  // Método público para check rápido sin incrementar
  async checkLimitOnly(userId: string, action: LimitAction): Promise<boolean> {
    const user = await this.getUserSubscription(userId);
    if (user.subscription_tier === 'premium') return true;

    const usage = await this.getCurrentUsage(userId, action);
    const limit = this.getLimitForAction(action);
    
    return usage < limit;
  }

  // Obtener estadísticas de uso para mostrar al usuario
  async getUsageStats(userId: string): Promise<any> {
    const { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!usage) return null;

    return {
      daily: {
        used: usage.daily_messages || 0,
        limit: this.FREE_LIMITS.daily_messages,
        remaining: Math.max(0, this.FREE_LIMITS.daily_messages - (usage.daily_messages || 0))
      },
      weekly: {
        used: usage.weekly_products || 0,
        limit: this.FREE_LIMITS.weekly_products,
        remaining: Math.max(0, this.FREE_LIMITS.weekly_products - (usage.weekly_products || 0))
      },
      monthly: {
        used: usage.monthly_ai_queries || 0,
        limit: this.FREE_LIMITS.monthly_ai_queries,
        remaining: Math.max(0, this.FREE_LIMITS.monthly_ai_queries - (usage.monthly_ai_queries || 0))
      }
    };
  }
}
