import { FastifyRequest, FastifyReply } from 'fastify';
import { runUrgentCheck } from '../../cron/daily-alerts.service';
import { logger } from '../../utils/logger';

export async function urgentCheckHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    logger.info('Urgent check cron job started');
    
    // Verificar autorización del cron
    const authHeader = request.headers.authorization;
    const cronSecret = process.env.CRON_SECRET || 'neverafy-cron-2024';
    
    if (!authHeader || !authHeader.includes(cronSecret)) {
      logger.warn('Unauthorized urgent check request attempt');
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    const startTime = Date.now();
    
    // Ejecutar chequeo de productos urgentes
    const result = await runUrgentCheck();
    
    const duration = Date.now() - startTime;
    
    logger.info('Urgent check cron job completed', {
      ...result,
      durationMs: duration
    });
    
    reply.code(200).send({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      results: result,
      message: `${result.criticalAlerts} critical alerts, ${result.urgentAlerts} urgent alerts sent`
    });

  } catch (error) {
    logger.error('Urgent check cron job failed:', error);
    
    reply.code(500).send({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
