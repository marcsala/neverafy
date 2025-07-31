import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { webhookVerification, webhookHandler } from './api/webhook';
import { dailyAlertsHandler } from './api/cron/daily-alerts';
import { urgentCheckHandler } from './api/cron/urgent-check';
import { weeklyReportsHandler } from './api/cron/weekly-reports';
import bizumWebhookHandler from './api/webhooks/bizum';
import subscriptionManagementHandler from './api/cron/subscription-management';
import smartEngagementHandler from './api/cron/smart-engagement';
import { validateWhatsAppConfig } from './config/whatsapp';
import { validateSupabaseConfig, testSupabaseConnection } from './config/supabase';
import { validateClaudeConfig, testClaudeConnection } from './config/claude';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Validar todas las configuraciones
async function validateAllConfigurations() {
  try {
    logger.info('Validating configurations...');
    
    validateWhatsAppConfig();
    logger.info('✅ WhatsApp configuration validated');
    
    validateSupabaseConfig();
    logger.info('✅ Supabase configuration validated');
    
    validateClaudeConfig();
    logger.info('✅ Claude configuration validated');
    
    // Test connections
    const supabaseOk = await testSupabaseConnection();
    const claudeOk = await testClaudeConnection();
    
    if (!supabaseOk) {
      logger.warn('⚠️ Supabase connection test failed, but continuing...');
    }
    
    if (!claudeOk) {
      logger.warn('⚠️ Claude connection test failed, but continuing...');
    }
    
    logger.info('🎉 All configurations validated successfully');
    
  } catch (error) {
    logger.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
}

// Crear instancia de Fastify
const fastify = Fastify({
  logger: false // Usamos winston en su lugar
});

// Wrapper function para convertir handlers Web API a Fastify
function wrapWebAPIHandler(handler: (req: Request) => Promise<Response>) {
  return async (request: any, reply: any) => {
    try {
      // Crear un objeto Request-like para el handler
      const webRequest = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        json: () => Promise.resolve(request.body),
        text: () => Promise.resolve(JSON.stringify(request.body))
      } as Request;

      // Llamar al handler original
      const response = await handler(webRequest);
      
      // Convertir Response a FastifyReply
      const text = await response.text();
      reply.status(response.status).send(text);
      
    } catch (error: unknown) {
      logger.error('Handler error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reply.status(500).send({ error: errorMessage });
    }
  };
}

// Registrar plugins
async function setupServer() {
  try {
    // CORS para desarrollo
    await fastify.register(cors, {
      origin: true
    });

    // Parse form data
    await fastify.register(formbody);

    // Ruta de salud del sistema
    fastify.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.BOT_VERSION || '1.5.0',
        phase: 5,
        features: {
          whatsapp: 'enabled',
          supabase: 'enabled',
          claude: 'enabled',
          products: 'enabled',
          commands: 'enabled',
          'ai-conversation': 'enabled',
          'intent-detection': 'enabled',
          'recipe-suggestions': 'enabled',
          'conversation-memory': 'enabled',
          'automatic-alerts': 'enabled',
          'weekly-reports': 'enabled',
          'cron-jobs': 'enabled',
          'limits-system': 'enabled',
          'payments-bizum': 'enabled',
          'subscription-management': 'enabled',
          'metrics-analytics': 'enabled',
          'smart-engagement': 'enabled'
        },
        uptime: process.uptime()
      };
    });

    // Ruta raíz
    fastify.get('/', async (request, reply) => {
      return {
        message: 'Neverafy WhatsApp Bot - Monetización Activa',
        version: process.env.BOT_VERSION || '1.5.0',
        phase: 5,
        status: 'active',
        features: {
          'Phase 1': ['WhatsApp Webhook', 'Basic Responses', 'Logging'],
          'Phase 2': ['Supabase Integration', 'Product Management', 'Commands', 'Claude AI'],
          'Phase 3': ['Advanced AI Conversation', 'Intent Detection', 'Recipe Suggestions', 'Conversation Memory'],
          'Phase 4': ['Automatic Alerts', 'Weekly Reports', 'Cron Jobs', 'Proactive Notifications'],
          'Phase 5': ['Limits System', 'Bizum Payments', 'Subscription Management', 'Analytics & Metrics', 'Smart Engagement']
        },
        monetization: {
          free_plan: {
            daily_messages: 20,
            weekly_products: 15,
            monthly_ai_queries: 50
          },
          premium_plan: {
            price: '€4.99/month',
            features: 'unlimited'
          }
        },
        endpoints: {
          health: '/health',
          webhook: '/api/webhook',
          bizum_webhook: '/api/webhooks/bizum'
        }
      };
    });

    // Webhook de WhatsApp - GET para verificación
    fastify.get('/api/webhook', webhookVerification);

    // Webhook de WhatsApp - POST para mensajes
    fastify.post('/api/webhook', webhookHandler);

    // Webhook de Bizum - POST para pagos (wrapped)
    fastify.post('/api/webhooks/bizum', wrapWebAPIHandler(bizumWebhookHandler));

    // Cron Jobs para alertas automáticas (Fase 4)
    fastify.post('/api/cron/daily-alerts', dailyAlertsHandler);
    fastify.post('/api/cron/urgent-check', urgentCheckHandler);
    fastify.post('/api/cron/weekly-reports', weeklyReportsHandler);

    // Cron Jobs para monetización (Fase 5) - wrapped
    fastify.post('/api/cron/subscription-management', wrapWebAPIHandler(subscriptionManagementHandler));
    fastify.post('/api/cron/smart-engagement', wrapWebAPIHandler(smartEngagementHandler));

    // Endpoint de testing para desarrollo
    if (process.env.NODE_ENV !== 'production') {
      fastify.post('/api/test/simulate-payment', async (request, reply) => {
        const { phoneNumber, amount, userCode } = request.body as any;
        
        const testPayload = {
          phoneNumber,
          amount: parseFloat(amount),
          concept: `PREMIUM-${userCode}`,
          reference: `test_${Date.now()}`,
          timestamp: new Date().toISOString(),
          transactionId: `test_tx_${Date.now()}`
        };

        try {
          // Simular webhook interno
          const mockRequest = {
            method: 'POST',
            json: () => Promise.resolve(testPayload)
          } as Request;

          const response = await bizumWebhookHandler(mockRequest);
          const responseText = await response.text();

          return {
            success: response.ok,
            status: response.status,
            message: 'Payment simulation completed',
            response: responseText,
            payload: testPayload
          };
        } catch (error: unknown) {
          logger.error('Payment simulation error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return {
            success: false,
            error: errorMessage,
            payload: testPayload
          };
        }
      });

      // Endpoint para ver métricas (desarrollo)
      fastify.get('/api/admin/metrics', async (request, reply) => {
        try {
          const { MetricsService } = await import('./services/metrics.service');
          const metricsService = new MetricsService();
          
          const metrics = await metricsService.getCurrentMetrics();
          return metrics;
        } catch (error: unknown) {
          logger.error('Metrics error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return { error: 'Failed to load metrics', details: errorMessage };
        }
      });
    }

    // Manejo de errores global
    fastify.setErrorHandler(async (error, request, reply) => {
      logger.error('Server error:', {
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method
      });

      reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Something went wrong'
      });
    });

    logger.info('Server setup completed successfully with monetization features');

  } catch (error) {
    logger.error('Failed to setup server:', error);
    process.exit(1);
  }
}

// Iniciar servidor
async function start() {
  try {
    // Validar todas las configuraciones primero
    await validateAllConfigurations();
    
    await setupServer();
    
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    
    logger.info(`🚀 Neverafy WhatsApp Bot started successfully with MONETIZATION`, {
      port,
      host,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.BOT_VERSION || '1.5.0',
      phase: 5,
      features: [
        'WhatsApp API', 
        'Supabase DB', 
        'Claude AI', 
        'Product Management', 
        'Advanced Conversation', 
        'Recipe Suggestions', 
        'Automatic Alerts', 
        'Weekly Reports',
        'Limits System',
        'Bizum Payments',
        'Subscription Management',
        'Analytics & Metrics',
        'Smart Engagement'
      ],
      monetization: {
        active: true,
        plans: ['Free (Limited)', 'Premium (€4.99/month)'],
        payment_methods: ['Bizum'],
        automation: ['Limits Enforcement', 'Auto Activation', 'Expiration Alerts']
      }
    });

    // Log adicional para monitoreo de producción
    if (process.env.NODE_ENV === 'production') {
      logger.info('💰 MONETIZATION SYSTEM ACTIVE - Ready to generate revenue!');
    }

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Manejo de shutdown graceful
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await fastify.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await fastify.close();
  process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar aplicación
start();