import { supabase } from '../config/supabase';
import { AlertsService } from '../services/alerts.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { ProductsService } from '../services/products.service';
import { UsersService } from '../services/users.service';
import { AIService } from '../services/ai.service';
import { ConversationService } from '../services/conversation.service';
import { logger } from '../utils/logger';

export class DailyAlertsService {
  private alertsService: AlertsService;

  constructor() {
    const whatsappService = new WhatsAppService();
    const productsService = new ProductsService();
    const usersService = new UsersService();
    const aiService = new AIService();
    const conversationService = new ConversationService();
    
    this.alertsService = new AlertsService(
      whatsappService,
      productsService,
      usersService,
      aiService,
      conversationService
    );
  }

  async processDailyAlerts(): Promise<{ processed: number; successful: number; failed: number }> {
    let processed = 0;
    let successful = 0;
    let failed = 0;

    try {
      const currentHour = new Date().getHours();
      logger.info(`Starting daily alerts process for hour: ${currentHour}`);

      // Obtener usuarios que deben recibir alertas en esta hora
      const { data: usersForAlert, error } = await supabase
        .rpc('get_users_for_alert_hour', { target_hour: currentHour });

      if (error) {
        logger.error('Error getting users for alert:', error);
        return { processed: 0, successful: 0, failed: 1 };
      }

      if (!usersForAlert || usersForAlert.length === 0) {
        logger.info(`No users found for alert at hour ${currentHour}`);
        return { processed: 0, successful: 0, failed: 0 };
      }

      logger.info(`Found ${usersForAlert.length} users for alerts at hour ${currentHour}`);

      // Procesar cada usuario
      for (const userData of usersForAlert) {
        processed++;
        
        try {
          // Obtener datos completos del usuario
          const { data: user } = await supabase
            .from('whatsapp_users')
            .select('*')
            .eq('id', userData.user_id)
            .single();

          if (!user) {
            logger.warn(`User not found: ${userData.user_id}`);
            failed++;
            continue;
          }

          // Verificar si el usuario ya recibió alerta hoy
          const today = new Date().toISOString().split('T')[0];
          const { data: todayAlerts } = await supabase
            .from('alert_logs')
            .select('id')
            .eq('user_id', user.id)
            .gte('sent_at', `${today}T00:00:00.000Z`)
            .lt('sent_at', `${today}T23:59:59.999Z`);

          // Si ya recibió alertas críticas/urgentes hoy, skip alerta diaria
          const hasUrgentAlertToday = todayAlerts?.some(alert => 
            ['critical', 'urgent'].includes(alert.alert_type)
          );

          if (hasUrgentAlertToday) {
            logger.info(`User ${user.phone_number} already received urgent alert today, skipping daily`);
            continue;
          }

          // Enviar alerta personalizada
          const alertSent = await this.alertsService.sendPersonalizedAlert(user);

          if (alertSent) {
            successful++;
            logger.info(`Alert sent successfully to ${user.phone_number}`);
          } else {
            logger.info(`No alert needed for ${user.phone_number}`);
          }

          // Delay entre usuarios para no saturar WhatsApp API
          await this.delay(2000); // 2 segundos

        } catch (userError) {
          logger.error(`Error processing alert for user ${userData.user_id}:`, userError);
          failed++;
        }
      }

      // Log del proceso completo
      await this.logDailyProcess(currentHour, processed, successful, failed);

      logger.info(`Daily alerts completed: ${processed} processed, ${successful} successful, ${failed} failed`);
      
      return { processed, successful, failed };

    } catch (error) {
      logger.error('Error in daily alerts process:', error);
      return { processed, successful, failed: failed + 1 };
    }
  }

  async processUrgentCheck(): Promise<{ criticalAlerts: number; urgentAlerts: number }> {
    let criticalAlerts = 0;
    let urgentAlerts = 0;

    try {
      logger.info('Starting urgent products check');

      // Obtener todos los usuarios activos
      const { data: activeUsers } = await supabase
        .from('whatsapp_users')
        .select('*')
        .eq('is_active', true)
        .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!activeUsers || activeUsers.length === 0) {
        logger.info('No active users found for urgent check');
        return { criticalAlerts: 0, urgentAlerts: 0 };
      }

      for (const user of activeUsers) {
        try {
          // Obtener productos del usuario
          const productsService = new ProductsService();
          const products = await productsService.getUserProducts(user.id);

          if (products.length === 0) continue;

          // Verificar productos críticos (caducan hoy)
          const criticalProducts = products.filter(p => p.daysLeft === 0);
          const urgentProducts = products.filter(p => p.daysLeft === 1);

          // Solo enviar alerta crítica si no se envió ya hoy
          if (criticalProducts.length > 0) {
            const hasAlertToday = await this.hasAlertToday(user.id, 'critical');
            
            if (!hasAlertToday) {
              const alertSent = await this.alertsService.sendPersonalizedAlert(user);
              if (alertSent) {
                criticalAlerts++;
                logger.info(`Critical alert sent to ${user.phone_number}`);
              }
            }
          }
          // Solo enviar alerta urgente si hay muchos productos (>2) y no se envió hoy
          else if (urgentProducts.length > 2) {
            const hasAlertToday = await this.hasAlertToday(user.id, 'urgent');
            
            if (!hasAlertToday) {
              const alertSent = await this.alertsService.sendPersonalizedAlert(user);
              if (alertSent) {
                urgentAlerts++;
                logger.info(`Urgent alert sent to ${user.phone_number}`);
              }
            }
          }

          // Delay para no saturar
          await this.delay(1000);

        } catch (userError) {
          logger.error(`Error checking urgent products for user ${user.id}:`, userError);
        }
      }

      logger.info(`Urgent check completed: ${criticalAlerts} critical, ${urgentAlerts} urgent alerts sent`);
      
      return { criticalAlerts, urgentAlerts };

    } catch (error) {
      logger.error('Error in urgent check process:', error);
      return { criticalAlerts: 0, urgentAlerts: 0 };
    }
  }

  private async hasAlertToday(userId: string, alertType: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: alerts, error } = await supabase
        .from('alert_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('alert_type', alertType)
        .gte('sent_at', `${today}T00:00:00.000Z`)
        .lt('sent_at', `${today}T23:59:59.999Z`)
        .limit(1);

      if (error) {
        logger.error('Error checking today alerts:', error);
        return false;
      }

      return (alerts && alerts.length > 0);
    } catch (error) {
      logger.error('Error in hasAlertToday:', error);
      return false;
    }
  }

  private async logDailyProcess(
    hour: number, 
    processed: number, 
    successful: number, 
    failed: number
  ): Promise<void> {
    try {
      await supabase
        .from('alert_logs')
        .insert({
          user_id: null, // System log
          alert_type: 'daily_process',
          products_count: processed,
          metadata: {
            hour,
            processed,
            successful,
            failed,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      logger.error('Error logging daily process:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Para uso en cron jobs
export async function runDailyAlerts(): Promise<any> {
  const service = new DailyAlertsService();
  return await service.processDailyAlerts();
}

export async function runUrgentCheck(): Promise<any> {
  const service = new DailyAlertsService();
  return await service.processUrgentCheck();
}
