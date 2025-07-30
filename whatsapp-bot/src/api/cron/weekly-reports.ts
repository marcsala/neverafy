import { FastifyRequest, FastifyReply } from 'fastify';
import { runWeeklyReports } from '../../cron/weekly-reports.service';
import { logger } from '../../utils/logger';

export async function weeklyReportsHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    logger.info('Weekly reports cron job started');
    
    // Verificar autorización del cron
    const authHeader = request.headers.authorization;
    const cronSecret = process.env.CRON_SECRET || 'neverafy-cron-2024';
    
    if (!authHeader || !authHeader.includes(cronSecret)) {
      logger.warn('Unauthorized weekly reports request attempt');
      reply.code(401).send({ error: 'Unauthorized' });
      return;
    }

    const startTime = Date.now();
    
    // Ejecutar proceso de reportes semanales
    const result = await runWeeklyReports();
    
    const duration = Date.now() - startTime;
    
    logger.info('Weekly reports cron job completed', {
      ...result,
      durationMs: duration
    });
    
    reply.code(200).send({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      results: result,
      message: `Processed ${result.processed} users, ${result.successful} reports sent successfully`
    });

  } catch (error) {
    logger.error('Weekly reports cron job failed:', error);
    
    reply.code(500).send({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}
