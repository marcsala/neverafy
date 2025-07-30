// src/services/payments.service.ts
import { supabase } from '../config/supabase';
import { WhatsAppService } from './whatsapp.service';
import { MetricsService } from './metrics.service';
import { UsersService } from './users.service';
import crypto from 'crypto';

export interface BizumWebhookData {
  phoneNumber: string;
  amount: number;
  concept: string;
  reference: string;
  timestamp: string;
  transactionId: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  concept: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'bizum';
  subscription_months: number;
  created_at: string;
}

export class PaymentsService {
  private readonly VALID_AMOUNTS = [4.99, 14.99, 49.99]; // 1 mes, 3 meses, 12 meses
  private readonly WEBHOOK_SECRET = process.env.BIZUM_WEBHOOK_SECRET!;

  constructor(
    private whatsappService: WhatsAppService,
    private metricsService: MetricsService,
    private usersService: UsersService
  ) {}

  async processBizumWebhook(paymentData: BizumWebhookData): Promise<void> {
    try {
      console.log('Processing Bizum payment:', { 
        phone: paymentData.phoneNumber, 
        amount: paymentData.amount,
        concept: paymentData.concept 
      });

      const { phoneNumber, amount, concept, reference, transactionId } = paymentData;
      const userCode = this.extractUserCode(concept);

      if (!userCode) {
        await this.handleInvalidConcept(phoneNumber, concept);
        return;
      }

      const user = await this.getUserByCode(userCode);
      if (!user) {
        await this.handleUserNotFound(phoneNumber, userCode);
        return;
      }

      const subscriptionPlan = this.getSubscriptionPlan(amount);
      if (!subscriptionPlan) {
        await this.handleInvalidAmount(user, amount);
        return;
      }

      const paymentRecord = await this.createPaymentRecord({
        user_id: user.user_id,
        transaction_id: transactionId,
        amount,
        concept,
        subscription_months: subscriptionPlan.months,
        phone_number: phoneNumber
      });

      const paymentType = this.getPaymentType(concept);
      switch (paymentType) {
        case 'premium':
        case 'upgrade':
          await this.activatePremium(user, subscriptionPlan, paymentRecord);
          break;
        case 'renewal':
        case 'renovar':
          await this.renewPremium(user, subscriptionPlan, paymentRecord);
          break;
        default:
          await this.activatePremium(user, subscriptionPlan, paymentRecord);
      }

    } catch (error) {
      console.error('Bizum webhook error:', error);
      await this.logPaymentError(paymentData, error);
    }
  }

  private extractUserCode(concept: string): string | null {
    const match = concept.match(/(?:PREMIUM|RENOVAR|REACTIVAR|UPGRADE)-([A-Z0-9]{6})/i);
    return match ? match[1].toUpperCase() : null;
  }

  private async getUserByCode(userCode: string) {
    const { data: users } = await supabase
      .from('whatsapp_users')
      .select('*');

    if (!users) return null;

    for (const user of users) {
      const generatedCode = this.generateUserCode(user.user_id);
      if (generatedCode === userCode) {
        return user;
      }
    }
    return null;
  }

  private generateUserCode(userId: string): string {
    return Buffer.from(userId.slice(-8), 'hex').toString('base64').slice(0, 6).toUpperCase();
  }

  private getSubscriptionPlan(amount: number) {
    const plans = {
      4.99: { months: 1, name: 'Premium Mensual', discount: 0 },
      14.99: { months: 3, name: 'Premium Trimestral', discount: 0.17 },
      49.99: { months: 12, name: 'Premium Anual', discount: 0.17 }
    };
    return plans[amount as keyof typeof plans] || null;
  }

  private getPaymentType(concept: string): string {
    const conceptLower = concept.toLowerCase();
    if (conceptLower.includes('premium') || conceptLower.includes('upgrade')) return 'premium';
    if (conceptLower.includes('renovar') || conceptLower.includes('renewal')) return 'renewal';
    return 'premium';
  }

  private async createPaymentRecord(data: {
    user_id: string;
    transaction_id: string;
    amount: number;
    concept: string;
    subscription_months: number;
    phone_number: string;
  }): Promise<PaymentRecord> {
    const { data: record, error } = await supabase
      .from('payment_records')
      .insert({
        user_id: data.user_id,
        transaction_id: data.transaction_id,
        amount: data.amount,
        concept: data.concept,
        payment_method: 'bizum',
        subscription_months: data.subscription_months,
        status: 'pending',
        metadata: {
          phone_number: data.phone_number,
          processed_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) throw error;
    return record;
  }

  private async activatePremium(user: any, plan: any, paymentRecord: PaymentRecord): Promise<void> {
    const now = new Date();
    const expirationDate = new Date(now);
    expirationDate.setMonth(expirationDate.getMonth() + plan.months);

    try {
      await supabase
        .from('whatsapp_users')
        .update({
          subscription_tier: 'premium',
          subscription_expires_at: expirationDate.toISOString(),
          subscription_activated_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', user.id);

      await this.markPaymentCompleted(paymentRecord.id);
      await this.resetUserLimits(user.user_id);
      await this.sendActivationConfirmation(user, plan, expirationDate);
      await this.metricsService.trackConversion(user.user_id, 'premium_activation', paymentRecord.amount);

      console.log(`Premium activated for user ${user.id} until ${expirationDate.toISOString()}`);
    } catch (error) {
      await this.markPaymentFailed(paymentRecord.id, error);
      throw error;
    }
  }

  private async renewPremium(user: any, plan: any, paymentRecord: PaymentRecord): Promise<void> {
    const currentExpiry = user.subscription_expires_at ? 
      new Date(user.subscription_expires_at) : new Date();
    
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    const newExpirationDate = new Date(baseDate);
    newExpirationDate.setMonth(newExpirationDate.getMonth() + plan.months);

    try {
      await supabase
        .from('whatsapp_users')
        .update({
          subscription_tier: 'premium',
          subscription_expires_at: newExpirationDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      await this.markPaymentCompleted(paymentRecord.id);
      await this.sendRenewalConfirmation(user, plan, newExpirationDate);
      await this.metricsService.trackConversion(user.user_id, 'premium_renewal', paymentRecord.amount);
    } catch (error) {
      await this.markPaymentFailed(paymentRecord.id, error);
      throw error;
    }
  }

  private async sendActivationConfirmation(user: any, plan: any, expiryDate: Date): Promise<void> {
    const formattedDate = expiryDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `🚀 *¡Premium activado exitosamente!*

✅ Pago confirmado: ${plan.name}
📅 Válido hasta: *${formattedDate}*

🎯 *Funciones desbloqueadas:*
• 📦 Productos ilimitados
• 🤖 IA avanzada sin restricciones
• ⚡ Alertas personalizadas
• 👨‍🍳 Recetas premium detalladas
• 📊 Analytics y estadísticas

*¡Disfruta de Neverafy sin límites!* 🎉

¿Necesitas ayuda? Escribe "ayuda premium"`;

    await this.whatsappService.sendMessage(user.phone_number, message);
  }

  private async sendRenewalConfirmation(user: any, plan: any, expiryDate: Date): Promise<void> {
    const formattedDate = expiryDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `🔄 *¡Suscripción renovada!*

✅ ${plan.name} activado
📅 Nueva fecha de vencimiento: *${formattedDate}*

🎉 Sigues disfrutando de todas las funciones premium sin interrupciones.

¡Gracias por seguir confiando en Neverafy! 💚`;

    await this.whatsappService.sendMessage(user.phone_number, message);
  }

  private async handleInvalidConcept(phoneNumber: string, concept: string): Promise<void> {
    const message = `❌ *Pago no procesado*

El concepto "${concept}" no es válido.

✅ *Formato correcto:*
PREMIUM-XXXXXX (tu código único)

💡 *Para obtener tu código:*
Envía "premium" y te daremos tu código personalizado.`;

    await this.whatsappService.sendMessage(phoneNumber, message);
  }

  private async handleUserNotFound(phoneNumber: string, userCode: string): Promise<void> {
    const message = `❌ *Usuario no encontrado*

El código ${userCode} no corresponde a ningún usuario registrado.

✅ *Para solucionarlo:*
1. Verifica que el código sea correcto
2. Asegúrate de haber usado Neverafy antes
3. Envía "premium" para obtener tu código`;

    await this.whatsappService.sendMessage(phoneNumber, message);
  }

  private async handleInvalidAmount(user: any, amount: number): Promise<void> {
    const message = `❌ *Monto no válido: €${amount}*

💰 *Planes disponibles:*
• €4.99 - Premium 1 mes
• €14.99 - Premium 3 meses (17% descuento)
• €49.99 - Premium 12 meses (17% descuento)

Por favor, envía el monto exacto para activar tu plan.`;

    await this.whatsappService.sendMessage(user.phone_number, message);
  }

  private async markPaymentCompleted(paymentId: string): Promise<void> {
    await supabase
      .from('payment_records')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', paymentId);
  }

  private async markPaymentFailed(paymentId: string, error: any): Promise<void> {
    await supabase
      .from('payment_records')
      .update({
        status: 'failed',
        error_message: error.message || 'Unknown error',
        failed_at: new Date().toISOString()
      })
      .eq('id', paymentId);
  }

  private async resetUserLimits(userId: string): Promise<void> {
    await supabase
      .from('user_usage')
      .upsert({
        user_id: userId,
        daily_messages: 0,
        weekly_products: 0,
        monthly_ai_queries: 0,
        products_stored: 0,
        last_reset_daily: new Date().toISOString(),
        last_reset_weekly: new Date().toISOString(),
        last_reset_monthly: new Date().toISOString()
      });
  }

  private async logPaymentError(paymentData: BizumWebhookData, error: any): Promise<void> {
    await supabase
      .from('payment_errors')
      .insert({
        phone_number: paymentData.phoneNumber,
        amount: paymentData.amount,
        concept: paymentData.concept,
        transaction_id: paymentData.transactionId,
        error_message: error.message,
        error_stack: error.stack,
        webhook_data: paymentData,
        created_at: new Date().toISOString()
      });
  }

  async checkSubscriptionStatus(userId: string): Promise<{
    tier: string;
    isActive: boolean;
    expiresAt: Date | null;
    daysRemaining: number;
  }> {
    const { data: user } = await supabase
      .from('whatsapp_users')
      .select('subscription_tier, subscription_expires_at')
      .eq('user_id', userId)
      .single();

    if (!user) {
      return { tier: 'free', isActive: false, expiresAt: null, daysRemaining: 0 };
    }

    const expiresAt = user.subscription_expires_at ? new Date(user.subscription_expires_at) : null;
    const isActive = user.subscription_tier === 'premium' && 
                    expiresAt && 
                    expiresAt > new Date();

    const daysRemaining = expiresAt ? 
      Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

    return {
      tier: user.subscription_tier || 'free',
      isActive: isActive || false,
      expiresAt,
      daysRemaining
    };
  }

  async sendExpirationReminder(userId: string): Promise<void> {
    const user = await this.usersService.getWhatsAppUserByUserId(userId);
    if (!user) return;

    const subscription = await this.checkSubscriptionStatus(userId);
    const userCode = this.generateUserCode(userId);

    if (subscription.daysRemaining <= 0) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        `⏰ *Tu Premium ha expirado*

Has vuelto al plan gratuito con límites:
• 📱 20 mensajes/día
• 📦 15 productos/semana  
• 🤖 50 consultas IA/mes

🚀 *Reactivar Premium:*
Bizum €4.99 a: *123456789*
Concepto: *REACTIVAR-${userCode}*

¿Prefieres otro plan? Envía "premium"`
      );
    } else if (subscription.daysRemaining <= 3) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        `⚠️ *Premium expira en ${subscription.daysRemaining} días*

📅 Vence: ${subscription.expiresAt?.toLocaleDateString('es-ES')}

🔄 *Renovar ahora:*
Bizum €4.99 a: *123456789*
Concepto: *RENOVAR-${userCode}*

💡 *Otros planes:*
• €14.99 - 3 meses (17% desc.)
• €49.99 - 12 meses (17% desc.)`
      );
    }
  }
}
