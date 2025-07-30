import { supabase } from '../config/supabase';
import { AlertsService } from '../services/alerts.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { ProductsService } from '../services/products.service';
import { UsersService } from '../services/users.service';
import { AIService } from '../services/ai.service';
import { ConversationService } from '../services/conversation.service';
import { logger } from '../utils/logger';

export class WeeklyReportsService {
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

  async processWeeklyReports(): Promise<{ processed: number; successful: number; failed: number }> {
    let processed = 0;
    let successful = 0;
    let failed = 0;

    try {
      logger.info('Starting weekly reports process');

      // Obtener usuarios activos que deben recibir reporte semanal
      const { data: activeUsers } = await supabase
        .from('whatsapp_users')
        .select(`
          *,
          alert_settings (
            enabled_alert_types,
            is_active
          )
        `)
        .eq('is_active', true)
        .gte('updated_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()); // Activos en últimas 2 semanas

      if (!activeUsers || activeUsers.length === 0) {
        logger.info('No active users found for weekly reports');
        return { processed: 0, successful: 0, failed: 0 };
      }

      // Filtrar usuarios que tienen reportes semanales habilitados
      const usersForReports = activeUsers.filter(user => {
        const alertSettings = user.alert_settings?.[0];
        if (!alertSettings) return true; // Por defecto habilitado
        
        return alertSettings.is_active && 
               alertSettings.enabled_alert_types?.includes('weekly_report');
      });

      logger.info(`Found ${usersForReports.length} users for weekly reports`);

      for (const user of usersForReports) {
        processed++;

        try {
          // Verificar si ya recibió reporte esta semana
          const hasReportThisWeek = await this.hasWeeklyReportThisWeek(user.id);
          
          if (hasReportThisWeek) {
            logger.info(`User ${user.phone_number} already received weekly report this week`);
            continue;
          }

          // Verificar que el usuario tenga actividad suficiente para justificar un reporte
          const hasActivity = await this.hasWeeklyActivity(user.id);
          
          if (!hasActivity) {
            logger.info(`User ${user.phone_number} has insufficient activity for weekly report`);
            continue;
          }

          // Generar y enviar reporte personalizado
          const reportSent = await this.generateAndSendWeeklyReport(user);

          if (reportSent) {
            successful++;
            logger.info(`Weekly report sent successfully to ${user.phone_number}`);
          } else {
            logger.warn(`Failed to send weekly report to ${user.phone_number}`);
            failed++;
          }

          // Delay entre usuarios
          await this.delay(3000); // 3 segundos entre reportes

        } catch (userError) {
          logger.error(`Error processing weekly report for user ${user.id}:`, userError);
          failed++;
        }
      }

      // Log del proceso completo
      await this.logWeeklyProcess(processed, successful, failed);

      logger.info(`Weekly reports completed: ${processed} processed, ${successful} successful, ${failed} failed`);
      
      return { processed, successful, failed };

    } catch (error) {
      logger.error('Error in weekly reports process:', error);
      return { processed, successful, failed: failed + 1 };
    }
  }

  private async generateAndSendWeeklyReport(user: any): Promise<boolean> {
    try {
      // Calcular estadísticas detalladas de la semana
      const weeklyStats = await this.calculateDetailedWeeklyStats(user.id);
      
      // Generar insights personalizados
      const insights = await this.generateWeeklyInsights(user, weeklyStats);
      
      // Crear reporte personalizado con IA
      const report = await this.createPersonalizedReport(user, weeklyStats, insights);
      
      // Enviar reporte usando el servicio de alertas
      return await this.alertsService.sendWeeklyReport(user);

    } catch (error) {
      logger.error('Error generating weekly report:', error);
      return false;
    }
  }

  private async calculateDetailedWeeklyStats(userId: string): Promise<any> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    try {
      // Obtener user_id real desde whatsapp_users
      const { data: whatsappUser } = await supabase
        .from('whatsapp_users')
        .select('user_id')
        .eq('id', userId)
        .single();

      const realUserId = whatsappUser?.user_id;

      // Productos añadidos esta semana
      const { data: addedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', realUserId)
        .gte('created_at', oneWeekAgo.toISOString());

      // Mensajes enviados esta semana
      const { data: conversationThisWeek } = await supabase
        .from('conversation_history')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', oneWeekAgo.toISOString());

      // Alertas recibidas esta semana
      const { data: alertsThisWeek } = await supabase
        .from('alert_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('sent_at', oneWeekAgo.toISOString());

      // Productos actuales
      const productsService = new ProductsService();
      const currentProducts = await productsService.getUserProducts(userId);

      // Cálculos estadísticos
      const totalValue = (addedProducts || []).reduce((sum, p) => sum + (p.price || 0), 0);
      const urgentProducts = currentProducts.filter(p => p.daysLeft <= 2).length;
      
      const categories = (addedProducts || []).reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCategory = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Sin datos';

      // Engagement score
      const userMessages = (conversationThisWeek || []).filter(m => m.role === 'user').length;
      const engagementScore = Math.min(1.0, userMessages / 10); // Max score con 10+ mensajes

      return {
        productsAdded: (addedProducts || []).length,
        totalValue,
        topCategory,
        currentProducts: currentProducts.length,
        urgentProducts,
        alertsReceived: (alertsThisWeek || []).length,
        criticalAlerts: (alertsThisWeek || []).filter(a => a.alert_type === 'critical').length,
        messagesExchanged: (conversationThisWeek || []).length,
        userEngagement: userMessages,
        engagementScore,
        categories: Object.keys(categories).length
      };
    } catch (error) {
      logger.error('Error calculating weekly stats:', error);
      return this.getDefaultWeeklyStats();
    }
  }

  private async generateWeeklyInsights(user: any, stats: any): Promise<string[]> {
    const insights: string[] = [];

    try {
      // Insight sobre productos añadidos
      if (stats.productsAdded === 0) {
        insights.push("💡 No añadiste productos esta semana. ¿Te ayudo a empezar?");
      } else if (stats.productsAdded > 10) {
        insights.push("🛒 ¡Compraste mucho esta semana! Planifica bien para no desperdiciar.");
      } else {
        insights.push(`📦 Añadiste ${stats.productsAdded} productos - ¡buen control!`);
      }

      // Insight sobre alertas críticas
      if (stats.criticalAlerts > 2) {
        insights.push("⚠️ Tuviste varias alertas críticas. Intenta planificar mejor las compras.");
      } else if (stats.criticalAlerts === 0) {
        insights.push("✅ ¡Perfecto! Sin desperdicios esta semana.");
      }

      // Insight sobre engagement
      if (stats.engagementScore > 0.7) {
        insights.push("🤖 ¡Excelente interacción! Aprovechas bien el bot.");
      } else if (stats.engagementScore < 0.3) {
        insights.push("💬 Podrías usar más el bot - ¡estoy aquí para ayudarte!");
      }

      // Insight sobre valor
      if (stats.totalValue > 50) {
        insights.push(`💰 Gestionaste ${stats.totalValue.toFixed(2)}€ en productos - ¡impresionante!`);
      }

      // Insight sobre categorías
      if (stats.categories > 4) {
        insights.push("🌈 Gran variedad de alimentos - ¡dieta equilibrada!");
      }

      return insights.slice(0, 3); // Máximo 3 insights por reporte
    } catch (error) {
      logger.error('Error generating insights:', error);
      return ["📊 Sigue usando el bot para obtener mejores insights."];
    }
  }

  private async createPersonalizedReport(user: any, stats: any, insights: string[]): Promise<string> {
    const phoneLastDigits = user.phone_number.slice(-4);
    
    return `📊 REPORTE SEMANAL

¡Hola usuario ${phoneLastDigits}! 👋

📈 **TU SEMANA EN NÚMEROS:**
📦 Productos añadidos: ${stats.productsAdded}
💰 Valor gestionado: ${stats.totalValue.toFixed(2)}€
🏆 Categoría principal: ${stats.topCategory}
⚠️ Productos urgentes actuales: ${stats.urgentProducts}
📱 Mensajes intercambiados: ${stats.messagesExchanged}

🎯 **INSIGHTS PERSONALIZADOS:**
${insights.join('\n')}

${this.getWeeklyRecommendation(stats)}

¡Seguimos mejorando tu gestión de nevera! 🚀

¿Necesitas ayuda con algo específico?`;
  }

  private getWeeklyRecommendation(stats: any): string {
    if (stats.urgentProducts > 3) {
      return "🎯 **RECOMENDACIÓN:** Tienes varios productos urgentes. ¡Hora de cocinar algo rico!";
    } else if (stats.productsAdded === 0) {
      return "🎯 **RECOMENDACIÓN:** Añade productos para aprovechar mejor las funciones del bot.";
    } else if (stats.criticalAlerts > 2) {
      return "🎯 **RECOMENDACIÓN:** Planifica las compras revisando primero lo que tienes.";
    } else {
      return "🎯 **RECOMENDACIÓN:** ¡Excelente gestión! Sigue así para evitar desperdicios.";
    }
  }

  private async hasWeeklyReportThisWeek(userId: string): Promise<boolean> {
    try {
      // Calcular inicio de la semana (lunes)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + daysToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: reports } = await supabase
        .from('alert_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('alert_type', 'weekly_report')
        .gte('sent_at', startOfWeek.toISOString())
        .limit(1);

      return (reports && reports.length > 0);
    } catch (error) {
      logger.error('Error checking weekly report:', error);
      return false;
    }
  }

  private async hasWeeklyActivity(userId: string): Promise<boolean> {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Verificar actividad en conversaciones o productos añadidos
      const [conversationActivity, productActivity] = await Promise.all([
        supabase
          .from('conversation_history')
          .select('id')
          .eq('user_id', userId)
          .eq('role', 'user')
          .gte('timestamp', oneWeekAgo.toISOString())
          .limit(1),
        
        supabase
          .from('whatsapp_users')
          .select('updated_at')
          .eq('id', userId)
          .gte('updated_at', oneWeekAgo.toISOString())
          .limit(1)
      ]);

      return (conversationActivity.data && conversationActivity.data.length > 0) ||
             (productActivity.data && productActivity.data.length > 0);
    } catch (error) {
      logger.error('Error checking weekly activity:', error);
      return true; // En caso de error, enviar reporte por defecto
    }
  }

  private getDefaultWeeklyStats(): any {
    return {
      productsAdded: 0,
      totalValue: 0,
      topCategory: 'Sin datos',
      currentProducts: 0,
      urgentProducts: 0,
      alertsReceived: 0,
      criticalAlerts: 0,
      messagesExchanged: 0,
      userEngagement: 0,
      engagementScore: 0,
      categories: 0
    };
  }

  private async logWeeklyProcess(processed: number, successful: number, failed: number): Promise<void> {
    try {
      await supabase
        .from('alert_logs')
        .insert({
          user_id: null, // System log
          alert_type: 'weekly_process',
          products_count: processed,
          metadata: {
            processed,
            successful,
            failed,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      logger.error('Error logging weekly process:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Para uso en cron jobs
export async function runWeeklyReports(): Promise<any> {
  const service = new WeeklyReportsService();
  return await service.processWeeklyReports();
}
