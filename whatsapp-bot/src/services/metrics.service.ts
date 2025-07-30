// src/services/metrics.service.ts
import { supabase } from '../config/supabase';

export interface MetricEvent {
  user_id: string;
  event_type: string;
  event_data?: any;
  session_id?: string;
  timestamp?: Date;
}

export interface ConversionData {
  user_id: string;
  conversion_type: 'premium_activation' | 'premium_renewal' | 'upsell_success';
  revenue: number;
  plan_type: string;
  source: string;
}

export class MetricsService {
  // Tracking de intenciones y uso
  async trackIntent(userId: string, intent: string, confidence: number): Promise<void> {
    try {
      await supabase
        .from('usage_events')
        .insert({
          user_id: userId,
          event_type: 'intent_detected',
          metadata: {
            intent,
            confidence,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking intent:', error);
    }
  }

  async trackUsage(userId: string, action: string): Promise<void> {
    try {
      await supabase
        .from('usage_events')
        .insert({
          user_id: userId,
          event_type: 'action_performed',
          metadata: {
            action,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }

  async trackUpsellOpportunity(userId: string, triggerAction: string): Promise<void> {
    try {
      await supabase
        .from('usage_events')
        .insert({
          user_id: userId,
          event_type: 'upsell_triggered',
          metadata: {
            trigger_action: triggerAction,
            timestamp: new Date().toISOString()
          }
        });

      // Incrementar contador de oportunidades
      await this.incrementUserMetric(userId, 'upsell_opportunities');
    } catch (error) {
      console.error('Error tracking upsell opportunity:', error);
    }
  }

  async trackConversion(userId: string, conversionType: string, revenue: number): Promise<void> {
    try {
      await supabase
        .from('conversion_events')
        .insert({
          user_id: userId,
          conversion_type: conversionType,
          revenue,
          converted_at: new Date().toISOString(),
          metadata: {
            plan_activated: this.getPlanFromRevenue(revenue)
          }
        });

      // Actualizar métricas del usuario
      await this.updateUserConversionMetrics(userId, revenue);
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  async trackError(phoneNumber: string, errorMessage: string): Promise<void> {
    try {
      await supabase
        .from('error_logs')
        .insert({
          phone_number: phoneNumber,
          error_message: errorMessage,
          error_type: 'message_processing',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking error:', error);
    }
  }

  // Métricas de retention y engagement
  async trackDailyActive(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await supabase
        .from('daily_active_users')
        .upsert({
          user_id: userId,
          date: today,
          last_activity: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking daily active:', error);
    }
  }

  async trackFeatureUsage(userId: string, feature: string, duration?: number): Promise<void> {
    try {
      await supabase
        .from('feature_usage')
        .insert({
          user_id: userId,
          feature_name: feature,
          usage_duration: duration,
          used_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  }

  // Analytics y reportes
  async getUserJourney(userId: string, days: number = 30): Promise<any[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const { data } = await supabase
      .from('usage_events')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    return data || [];
  }

  async getConversionFunnel(startDate: Date, endDate: Date): Promise<any> {
    // Funnel: Registro -> Primer uso -> Límite alcanzado -> Conversión
    const { data: registrations } = await supabase
      .from('whatsapp_users')
      .select('id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const { data: firstUse } = await supabase
      .from('usage_events')
      .select('user_id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('event_type', 'action_performed')
      .limit(1000);

    const { data: limitReached } = await supabase
      .from('usage_events')
      .select('user_id')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('event_type', 'upsell_triggered');

    const { data: conversions } = await supabase
      .from('conversion_events')
      .select('user_id')
      .gte('converted_at', startDate.toISOString())
      .lte('converted_at', endDate.toISOString());

    return {
      registrations: registrations?.length || 0,
      first_use: new Set(firstUse?.map(u => u.user_id)).size || 0,
      limit_reached: new Set(limitReached?.map(u => u.user_id)).size || 0,
      conversions: conversions?.length || 0,
      conversion_rate: conversions?.length && registrations?.length ? 
        (conversions.length / registrations.length * 100).toFixed(2) + '%' : '0%'
    };
  }

  async getRevenueDashboard(days: number = 30): Promise<any> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data: payments } = await supabase
      .from('payment_records')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed');

    if (!payments) return null;

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const averageRevenue = payments.length > 0 ? totalRevenue / payments.length : 0;

    // Revenue por plan
    const planBreakdown = {
      monthly: payments.filter(p => p.amount === 4.99),
      quarterly: payments.filter(p => p.amount === 14.99),
      yearly: payments.filter(p => p.amount === 49.99)
    };

    // MRR (Monthly Recurring Revenue)
    const monthlyRevenue = planBreakdown.monthly.length * 4.99 +
                          planBreakdown.quarterly.length * (14.99 / 3) +
                          planBreakdown.yearly.length * (49.99 / 12);

    return {
      total_revenue: totalRevenue,
      payment_count: payments.length,
      average_revenue_per_user: averageRevenue,
      monthly_recurring_revenue: monthlyRevenue,
      plan_breakdown: {
        monthly: planBreakdown.monthly.length,
        quarterly: planBreakdown.quarterly.length,
        yearly: planBreakdown.yearly.length
      },
      daily_revenue: this.groupByDay(payments)
    };
  }

  async getEngagementMetrics(days: number = 7): Promise<any> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // DAU (Daily Active Users)
    const { data: dailyActive } = await supabase
      .from('daily_active_users')
      .select('date, user_id')
      .gte('date', startDate.toISOString().split('T')[0]);

    // Mensaje promedio por usuario
    const { data: messageStats } = await supabase
      .from('usage_events')
      .select('user_id')
      .eq('event_type', 'action_performed')
      .gte('created_at', startDate.toISOString());

    // Retention rate
    const { data: weekAgoUsers } = await supabase
      .from('daily_active_users')
      .select('user_id')
      .eq('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const { data: todayUsers } = await supabase
      .from('daily_active_users')
      .select('user_id')
      .eq('date', new Date().toISOString().split('T')[0]);

    const retainedUsers = todayUsers?.filter(u => 
      weekAgoUsers?.some(w => w.user_id === u.user_id)
    ).length || 0;

    const retentionRate = weekAgoUsers?.length ? 
      (retainedUsers / weekAgoUsers.length * 100).toFixed(2) + '%' : '0%';

    return {
      daily_active_users: dailyActive?.length || 0,
      average_messages_per_user: messageStats?.length && dailyActive?.length ? 
        (messageStats.length / new Set(dailyActive.map(u => u.user_id)).size).toFixed(1) : 0,
      seven_day_retention_rate: retentionRate,
      retained_users: retainedUsers,
      total_week_ago_users: weekAgoUsers?.length || 0,
      engagement_by_day: this.groupEngagementByDay(dailyActive || [])
    };
  }

  async getCurrentMetrics(): Promise<any> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisMonth = now.toISOString().substring(0, 7);

    // Métricas del día
    const { data: todayActive } = await supabase
      .from('daily_active_users')
      .select('user_id')
      .eq('date', today);

    const { data: todayMessages } = await supabase
      .from('usage_events')
      .select('id')
      .eq('event_type', 'action_performed')
      .gte('created_at', today + 'T00:00:00.000Z');

    const { data: todayConversions } = await supabase
      .from('conversion_events')
      .select('revenue')
      .gte('converted_at', today + 'T00:00:00.000Z');

    const { data: monthlyRevenue } = await supabase
      .from('payment_records')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', thisMonth + '-01T00:00:00.000Z');

    return {
      today: {
        active_users: todayActive?.length || 0,
        messages_sent: todayMessages?.length || 0,
        conversions: todayConversions?.length || 0,
        revenue: todayConversions?.reduce((sum, c) => sum + c.revenue, 0) || 0
      },
      this_month: {
        total_revenue: monthlyRevenue?.reduce((sum, p) => sum + p.amount, 0) || 0,
        total_payments: monthlyRevenue?.length || 0
      },
      timestamp: now.toISOString()
    };
  }

  // Helper methods
  private async incrementUserMetric(userId: string, metric: string): Promise<void> {
    await supabase.rpc('increment_user_metric', {
      user_id: userId,
      metric_name: metric
    });
  }

  private async updateUserConversionMetrics(userId: string, revenue: number): Promise<void> {
    await supabase
      .from('user_metrics')
      .upsert({
        user_id: userId,
        total_revenue: revenue,
        conversion_count: 1,
        last_conversion_at: new Date().toISOString()
      });
  }

  private getPlanFromRevenue(revenue: number): string {
    if (revenue === 4.99) return 'monthly';
    if (revenue === 14.99) return 'quarterly';
    if (revenue === 49.99) return 'yearly';
    return 'unknown';
  }

  private groupByDay(data: any[], dateField: string = 'created_at'): any {
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count
    }));
  }

  private groupEngagementByDay(data: any[]): any {
    const grouped = data.reduce((acc, item) => {
      const date = item.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, users]) => ({
        date,
        active_users: users
      }));
  }

  async generateReport(reportType: string, startDate: Date, endDate: Date): Promise<any> {
    switch (reportType) {
      case 'revenue':
        return this.getRevenueDashboard(Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      case 'engagement':
        return this.getEngagementMetrics(Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      case 'conversion':
        return this.getConversionFunnel(startDate, endDate);
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
  }
}
