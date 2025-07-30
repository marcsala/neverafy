import { supabase } from '../config/supabase';
import { WhatsAppService } from './whatsapp.service';
import { ProductsService } from './products.service';
import { UsersService } from './users.service';
import { AIService } from './ai.service';
import { ConversationService } from './conversation.service';
import { WhatsAppUser, Product } from '../types/shared.types';
import { logger } from '../utils/logger';

export interface AlertPreferences {
  userId: string;
  alertTime: string; // HH:MM format
  timezone: string;
  alertDays: number[]; // 0=Sunday, 1=Monday, etc.
  minValueAlert: number; // Minimum value to trigger alert
  urgentDaysThreshold: number; // Days considered urgent
  enabledAlertTypes: string[];
}

export interface AlertMetrics {
  totalAlertsSent: number;
  criticalAlerts: number;
  urgentAlerts: number;
  dailyUpdates: number;
  weeklyReports: number;
  lastAlertSent?: string;
}

export class AlertsService {
  constructor(
    private whatsappService: WhatsAppService,
    private productsService: ProductsService,
    private usersService: UsersService,
    private aiService: AIService,
    private conversationService: ConversationService
  ) {}

  async sendPersonalizedAlert(user: WhatsAppUser): Promise<boolean> {
    try {
      logger.info(`Processing personalized alert for user: ${user.phone_number}`);
      
      // Obtener productos y preferencias del usuario
      const [products, preferences] = await Promise.all([
        this.productsService.getUserProducts(user.id),
        this.getUserAlertPreferences(user.id)
      ]);

      if (products.length === 0) {
        // Usuario sin productos - enviar mensaje motivacional ocasional
        return await this.sendNoProductsMessage(user);
      }

      // Determinar tipo de alerta según urgencia
      const alertType = this.determineAlertType(products);
      
      // Generar alerta personalizada con IA
      const alertMessage = await this.generateIntelligentAlert(user, products, alertType, preferences);
      
      if (!alertMessage) {
        logger.info(`No alert needed for user ${user.phone_number}`);
        return false;
      }

      // Enviar alerta
      const success = await this.whatsappService.sendMessage(user.phone_number, alertMessage);
      
      if (success) {
        // Registrar alerta enviada
        await this.logAlertSent(user.id, alertType, products.length);
        
        // Guardar en historial de conversación
        await this.conversationService.saveMessage(user.id, 'assistant', alertMessage, `alert_${alertType}`);
        
        logger.info(`Alert sent successfully to ${user.phone_number}: ${alertType}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error sending personalized alert:', error);
      return false;
    }
  }

  async sendWeeklyReport(user: WhatsAppUser): Promise<boolean> {
    try {
      logger.info(`Generating weekly report for user: ${user.phone_number}`);
      
      const weeklyStats = await this.calculateWeeklyStats(user.id);
      const report = await this.generateWeeklyReport(user, weeklyStats);
      
      const success = await this.whatsappService.sendMessage(user.phone_number, report);
      
      if (success) {
        await this.logAlertSent(user.id, 'weekly_report', 0);
        await this.conversationService.saveMessage(user.id, 'assistant', report, 'weekly_report');
      }
      
      return success;
    } catch (error) {
      logger.error('Error sending weekly report:', error);
      return false;
    }
  }

  private async generateIntelligentAlert(
    user: WhatsAppUser, 
    products: Product[], 
    alertType: string,
    preferences: AlertPreferences
  ): Promise<string | null> {
    try {
      const context = await this.buildAlertContext(user, products);
      
      let prompt = '';
      
      switch (alertType) {
        case 'critical':
          prompt = this.buildCriticalAlertPrompt(user, products, context);
          break;
        case 'urgent':
          prompt = this.buildUrgentAlertPrompt(user, products, context);
          break;
        case 'daily':
          prompt = this.buildDailyUpdatePrompt(user, products, context);
          break;
        case 'none':
          return null;
        default:
          return null;
      }

      const response = await this.aiService.aiService.generateContextualResponse(prompt, context);
      return this.formatAlertMessage(response.message, alertType);
    } catch (error) {
      logger.error('Error generating intelligent alert:', error);
      return this.getFallbackAlert(alertType, products);
    }
  }

  private determineAlertType(products: Product[]): string {
    const expireToday = products.filter(p => p.daysLeft === 0);
    const expireTomorrow = products.filter(p => p.daysLeft === 1);
    const urgent = products.filter(p => p.daysLeft <= 2);

    if (expireToday.length > 0) return 'critical';
    if (expireTomorrow.length > 2 || urgent.length > 3) return 'urgent';
    if (products.length > 0) return 'daily';
    return 'none';
  }

  private buildCriticalAlertPrompt(user: WhatsAppUser, products: Product[], context: any): string {
    const expireToday = products.filter(p => p.daysLeft === 0);
    const totalValue = expireToday.reduce((sum, p) => sum + (p.price || 0), 0);

    return `
Usuario: ${user.phone_number}
Situación: CRÍTICA - ${expireToday.length} productos caducan HOY
Productos que caducan hoy: ${expireToday.map(p => `${p.name} (${p.price?.toFixed(2) || '0.00'}€)`).join(', ')}
Valor en riesgo: ${totalValue.toFixed(2)}€

Genera una alerta URGENTE pero útil que:
1. Sea directa sobre la urgencia sin alarmar
2. Liste los productos específicos
3. Sugiera acciones concretas (recetas, congelar, compartir)
4. Incluya el valor económico en riesgo
5. Mantenga un tono motivador
6. Máximo 350 caracteres para WhatsApp

Incluye emojis: 🚨 para urgencia, 💰 para valor, 🍽️ para recetas
`;
  }

  private buildUrgentAlertPrompt(user: WhatsAppUser, products: Product[], context: any): string {
    const urgent = products.filter(p => p.daysLeft <= 2);
    
    return `
Usuario: ${user.phone_number}
Situación: URGENTE - ${urgent.length} productos caducan pronto
Productos urgentes: ${urgent.map(p => `${p.name} (${p.daysLeft} días)`).join(', ')}

Genera una alerta que:
1. Sea amigable pero clara sobre la urgencia
2. Mencione los productos que caducan pronto
3. Sugiera planificar comidas para esta semana
4. Ofrezca ayuda con recetas
5. Mantenga tono positivo y proactivo
6. Máximo 300 caracteres

Incluye emojis: ⚠️ para urgencia, 📅 para planificación, 👨‍🍳 para cocina
`;
  }

  private buildDailyUpdatePrompt(user: WhatsAppUser, products: Product[], context: any): string {
    const stats = context.userStats;
    
    return `
Usuario: ${user.phone_number}
Estado nevera: ${products.length} productos, ${stats.totalValue.toFixed(2)}€ total
Productos urgentes: ${stats.urgentProducts}
Categoría principal: ${stats.topCategory}

Genera un saludo diario que:
1. Sea un saludo natural (Buenos días, etc.)
2. Resuma el estado de la nevera positivamente
3. Mencione algo específico si hay urgencias
4. Sugiera planificación del día si es apropiado
5. Sea breve y motivador
6. Máximo 250 caracteres

Incluye emojis: ☀️ para saludo, 📊 para estado, 🎯 para planificación
`;
  }

  private async buildAlertContext(user: WhatsAppUser, products: Product[]): Promise<any> {
    const userStats = await this.productsService.getUserStats(user.id);
    const recentHistory = await this.conversationService.getRecentHistory(user.id, 5);
    
    return {
      user,
      products,
      userStats,
      conversationHistory: recentHistory
    };
  }

  private formatAlertMessage(message: string, alertType: string): string {
    // Añadir prefijo según tipo de alerta
    const prefixes = {
      critical: '🚨 ALERTA CRÍTICA',
      urgent: '⚠️ ALERTA URGENTE',
      daily: '☀️ RESUMEN DIARIO',
      weekly_report: '📊 REPORTE SEMANAL'
    };

    const prefix = prefixes[alertType] || '';
    return prefix ? `${prefix}\n\n${message}` : message;
  }

  private getFallbackAlert(alertType: string, products: Product[]): string {
    const fallbacks = {
      critical: `🚨 URGENTE: ${products.filter(p => p.daysLeft === 0).length} productos caducan HOY. Revisa tu nevera para evitar desperdicios.`,
      urgent: `⚠️ Tienes ${products.filter(p => p.daysLeft <= 2).length} productos que caducan pronto. ¿Planificamos las comidas de esta semana?`,
      daily: `☀️ Buenos días! Tu nevera tiene ${products.length} productos. ${products.filter(p => p.daysLeft <= 2).length > 0 ? 'Algunos necesitan atención pronto.' : 'Todo bajo control.'}`,
      weekly_report: '📊 Resumen semanal: Tu gestión de nevera va bien. ¡Sigue así!'
    };

    return fallbacks[alertType] || 'Recordatorio: Revisa tu nevera periódicamente 📱';
  }

  private async sendNoProductsMessage(user: WhatsAppUser): Promise<boolean> {
    // Solo enviar mensaje motivacional ocasionalmente (1 vez por semana)
    const lastMotivational = await this.getLastAlertOfType(user.id, 'motivational');
    const daysSinceLastMotivational = lastMotivational 
      ? Math.ceil((Date.now() - new Date(lastMotivational).getTime()) / (1000 * 60 * 60 * 24))
      : 7;

    if (daysSinceLastMotivational < 7) {
      return false; // No enviar aún
    }

    const message = `👋 ¡Hola! Hace tiempo que no añades productos a tu nevera.

¿Te ayudo a empezar? Solo escribe algo como:
• "tengo leche que caduca el viernes"
• "compré pan integral"

¡Estoy aquí para ayudarte a no desperdiciar comida! 🏠`;

    const success = await this.whatsappService.sendMessage(user.phone_number, message);
    
    if (success) {
      await this.logAlertSent(user.id, 'motivational', 0);
    }

    return success;
  }

  private async calculateWeeklyStats(userId: string): Promise<any> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    try {
      // Productos añadidos esta semana
      const { data: addedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', (await supabase.from('whatsapp_users').select('user_id').eq('id', userId).single()).data?.user_id)
        .gte('created_at', oneWeekAgo.toISOString());

      // Alertas enviadas esta semana
      const { data: alertsThisWeek } = await supabase
        .from('alert_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('sent_at', oneWeekAgo.toISOString());

      const totalValue = (addedProducts || []).reduce((sum, p) => sum + (p.price || 0), 0);
      const categories = (addedProducts || []).reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCategory = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Sin categoría';

      return {
        productsAdded: (addedProducts || []).length,
        totalValue,
        topCategory,
        alertsReceived: (alertsThisWeek || []).length,
        criticalAlerts: (alertsThisWeek || []).filter(a => a.alert_type === 'critical').length
      };
    } catch (error) {
      logger.error('Error calculating weekly stats:', error);
      return {
        productsAdded: 0,
        totalValue: 0,
        topCategory: 'Sin datos',
        alertsReceived: 0,
        criticalAlerts: 0
      };
    }
  }

  private async generateWeeklyReport(user: WhatsAppUser, stats: any): Promise<string> {
    return `📊 REPORTE SEMANAL

¡Hola ${user.phone_number.slice(-4)}! Aquí tu resumen:

📦 Productos añadidos: ${stats.productsAdded}
💰 Valor gestionado: ${stats.totalValue.toFixed(2)}€
🏆 Categoría principal: ${stats.topCategory}
📱 Alertas recibidas: ${stats.alertsReceived}

${stats.criticalAlerts > 0 
  ? `⚠️ Tuviste ${stats.criticalAlerts} alertas críticas - ¡mejoremos la planificación!`
  : '✅ ¡Excelente gestión! Sin productos desperdiciados.'
}

🎯 Tip de la semana: Planifica las compras según lo que ya tienes en casa.

¡Seguimos mejorando juntos! 🚀`;
  }

  private async getUserAlertPreferences(userId: string): Promise<AlertPreferences> {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        return {
          userId,
          alertTime: '09:00',
          timezone: 'Europe/Madrid',
          alertDays: [1, 2, 3, 4, 5, 6, 7], // Todos los días
          minValueAlert: 1.00,
          urgentDaysThreshold: 2,
          enabledAlertTypes: ['critical', 'urgent', 'daily']
        };
      }

      // Valores por defecto
      return {
        userId,
        alertTime: '09:00',
        timezone: 'Europe/Madrid',
        alertDays: [1, 2, 3, 4, 5, 6, 7],
        minValueAlert: 1.00,
        urgentDaysThreshold: 2,
        enabledAlertTypes: ['critical', 'urgent', 'daily']
      };
    } catch (error) {
      logger.error('Error getting alert preferences:', error);
      return {
        userId,
        alertTime: '09:00',
        timezone: 'Europe/Madrid',
        alertDays: [1, 2, 3, 4, 5, 6, 7],
        minValueAlert: 1.00,
        urgentDaysThreshold: 2,
        enabledAlertTypes: ['critical', 'urgent', 'daily']
      };
    }
  }

  private async logAlertSent(userId: string, alertType: string, productsCount: number): Promise<void> {
    try {
      await supabase
        .from('alert_logs')
        .insert({
          user_id: userId,
          alert_type: alertType,
          products_count: productsCount,
          sent_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('Error logging alert:', error);
    }
  }

  private async getLastAlertOfType(userId: string, alertType: string): Promise<string | null> {
    try {
      const { data } = await supabase
        .from('alert_logs')
        .select('sent_at')
        .eq('user_id', userId)
        .eq('alert_type', alertType)
        .order('sent_at', { ascending: false })
        .limit(1)
        .single();

      return data?.sent_at || null;
    } catch (error) {
      return null;
    }
  }

  async getAlertMetrics(userId: string): Promise<AlertMetrics> {
    try {
      const { data: alerts } = await supabase
        .from('alert_logs')
        .select('*')
        .eq('user_id', userId);

      if (!alerts) {
        return {
          totalAlertsSent: 0,
          criticalAlerts: 0,
          urgentAlerts: 0,
          dailyUpdates: 0,
          weeklyReports: 0
        };
      }

      return {
        totalAlertsSent: alerts.length,
        criticalAlerts: alerts.filter(a => a.alert_type === 'critical').length,
        urgentAlerts: alerts.filter(a => a.alert_type === 'urgent').length,
        dailyUpdates: alerts.filter(a => a.alert_type === 'daily').length,
        weeklyReports: alerts.filter(a => a.alert_type === 'weekly_report').length,
        lastAlertSent: alerts[alerts.length - 1]?.sent_at
      };
    } catch (error) {
      logger.error('Error getting alert metrics:', error);
      return {
        totalAlertsSent: 0,
        criticalAlerts: 0,
        urgentAlerts: 0,
        dailyUpdates: 0,
        weeklyReports: 0
      };
    }
  }
}
