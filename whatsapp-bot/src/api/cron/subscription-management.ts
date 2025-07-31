// src/api/cron/subscription-management.ts
import { PaymentsService } from '../../services/payments.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { MetricsService } from '../../services/metrics.service';
import { UsersService } from '../../services/users.service';
import { supabase } from '../../config/supabase';

export default async function handler(req: Request) {
  try {
    console.log('Running subscription management cron...');
    
    const whatsappService = new WhatsAppService();
    const metricsService = new MetricsService();
    const usersService = new UsersService();
    const paymentsService = new PaymentsService(whatsappService, metricsService, usersService);

    // 1. Recordatorios de expiración
    await sendExpirationReminders(paymentsService);
    
    // 2. Degradar suscripciones expiradas
    await downgradeExpiredSubscriptions();
    
    // 3. Limpiar contextos de conversación expirados
    await cleanExpiredContexts();
    
    // 4. Procesar mensajes programados
    await processScheduledMessages(whatsappService);

    console.log('Subscription management cron completed successfully');
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Subscription management cron error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function sendExpirationReminders(paymentsService: PaymentsService) {
  // Buscar usuarios con suscripciones que expiran en 3 días o menos
  const { data: expiringUsers } = await supabase
    .from('whatsapp_users')
    .select('*')
    .eq('subscription_tier', 'premium')
    .gte('subscription_expires_at', new Date().toISOString())
    .lte('subscription_expires_at', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());

  if (!expiringUsers) return;

  for (const user of expiringUsers) {
    try {
      await paymentsService.sendExpirationReminder(user.user_id);
      
      // Marcar recordatorio enviado para evitar spam
      await supabase
        .from('whatsapp_users')
        .update({ 
          last_expiration_reminder: new Date().toISOString() 
        })
        .eq('id', user.id);

      // Esperar entre envíos para no saturar
      await sleep(2000);
      
    } catch (error) {
      console.error(`Failed to send expiration reminder to user ${user.id}:`, error);
    }
  }

  console.log(`Sent ${expiringUsers.length} expiration reminders`);
}

async function downgradeExpiredSubscriptions() {
  // Buscar suscripciones expiradas que aún están marcadas como premium
  const { data: expiredUsers } = await supabase
    .from('whatsapp_users')
    .select('*')
    .eq('subscription_tier', 'premium')
    .lt('subscription_expires_at', new Date().toISOString());

  if (!expiredUsers) return;

  for (const user of expiredUsers) {
    try {
      // Degradar a free
      await supabase
        .from('whatsapp_users')
        .update({
          subscription_tier: 'free',
          downgraded_at: new Date().toISOString()
        })
        .eq('id', user.id);

      console.log(`Downgraded user ${user.id} from premium to free`);
      
    } catch (error) {
      console.error(`Failed to downgrade user ${user.id}:`, error);
    }
  }

  console.log(`Downgraded ${expiredUsers.length} expired subscriptions`);
}

async function cleanExpiredContexts() {
  const { error } = await supabase
    .from('conversation_context')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error cleaning expired contexts:', error);
  } else {
    console.log('Cleaned expired conversation contexts');
  }
}

async function processScheduledMessages(whatsappService: WhatsAppService) {
  const { data: scheduledMessages } = await supabase
    .from('scheduled_messages')
    .select(`
      *,
      whatsapp_users (phone_number)
    `)
    .lte('scheduled_for', new Date().toISOString())
    .eq('status', 'pending');

  if (!scheduledMessages) return;

  for (const message of scheduledMessages) {
    try {
      let messageText = '';
      
      switch (message.message_type) {
        case 'upsell_followup':
          messageText = generateUpsellFollowup(message.context_data);
          break;
        case 'engagement':
          messageText = generateEngagementMessage(message.context_data);
          break;
        case 'feature_announcement':
          messageText = message.context_data.message;
          break;
      }

      if (messageText && message.whatsapp_users?.phone_number) {
        await whatsappService.sendMessage(
          message.whatsapp_users.phone_number,
          messageText
        );

        // Marcar como enviado
        await supabase
          .from('scheduled_messages')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', message.id);
      }

      await sleep(1000);
      
    } catch (error) {
      console.error(`Failed to send scheduled message ${message.id}:`, error);
      
      // Marcar como fallido
      await supabase
        .from('scheduled_messages')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', message.id);
    }
  }

  console.log(`Processed ${scheduledMessages.length} scheduled messages`);
}

function generateUpsellFollowup(contextData: any): string {
  const attempts = contextData.attempts || 1;
  
  if (attempts === 1) {
    return `🤔 *¿Sigues interesado en Premium?*

Hace 24h alcanzaste tus límites gratuitos.

⭐ *Con Premium obtienes:*
• 🚀 Todo ilimitado
• 🤖 IA más avanzada
• 📊 Analytics detallados

💳 Solo €4.99/mes
¿Te ayudamos a activarlo?`;
  } else if (attempts === 2) {
    return `💭 *Última oportunidad Premium*

Has usado varios límites gratuitos esta semana.

🎯 *Usuarios Premium ahorran más:*
• Mejor gestión de productos
• Menos desperdicio alimentario
• Recetas más eficientes

¿Probamos Premium 1 mes?`;
  }
  
  return ''; // No más follow-ups después del segundo intento
}

function generateEngagementMessage(contextData: any): string {
  return `👋 ¡Hola! ¿Cómo va tu nevera hoy?

💡 *Recordatorio:*
• Revisa productos próximos a caducar
• Añade las compras de hoy
• Pide recetas personalizadas

¿En qué te ayudo? 🤖`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
