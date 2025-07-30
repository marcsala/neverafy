import { FastifyRequest, FastifyReply } from 'fastify';
import { runDailyAlerts } from '../../cron/daily-alerts.service';
import { logger } from '../../utils/logger';

export async function dailyAlertsHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    logger.info('Daily alerts cron job started');
    
    // Verificar autorización del cron (Vercel envía headers específicos)
    const authHeader = request.headers.authorization;
    const cronSecret = process.env.CRON_SECRET || 'neverafy-cron-2024';
    
    if (!authHeader || !authHeader.includes(cronSecret)) {
      logger.warn('Unauthorized cron request attempt');
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    const startTime = Date.now();
    
    // Ejecutar proceso de alertas diarias
    const result = await runDailyAlerts();
    
    const duration = Date.now() - startTime;
    
    logger.info('Daily alerts cron job completed', {
      ...result,
      durationMs: duration
    });
    
    reply.code(200).send({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      results: result,
      message: `Processed ${result.processed} users, ${result.successful} alerts sent successfully`
    });

  } catch (error) {
    logger.error('Daily alerts cron job failed:', error);
    
    reply.code(500).send({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
