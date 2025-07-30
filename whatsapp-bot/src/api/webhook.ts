import { FastifyRequest, FastifyReply } from 'fastify';
import { WhatsAppWebhookBody, WhatsAppMessage } from '../types/whatsapp.types';
import { whatsappConfig } from '../config/whatsapp';
import { WhatsAppService } from '../services/whatsapp.service';
import { MessageHandler } from '../handlers/message.handler';
import { logger, logRequest, logError } from '../utils/logger';

const whatsappService = new WhatsAppService();
const messageHandler = new MessageHandler(whatsappService);

// Verificación del webhook (GET request de Meta)
export async function webhookVerification(
  request: FastifyRequest<{ Querystring: { 
    'hub.mode': string;
    'hub.verify_token': string;
    'hub.challenge': string;
  }}>,
  reply: FastifyReply
): Promise<void> {
  try {
    logRequest(request);
    
    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];
    const challenge = request.query['hub.challenge'];

    logger.info('Webhook verification request:', { mode, token });

    // Verificar que es una suscripción y el token es correcto
    if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
      logger.info('Webhook verified successfully');
      reply.code(200).send(challenge);
    } else {
      logger.warn('Webhook verification failed:', { 
        expectedToken: whatsappConfig.webhookVerifyToken,
        receivedToken: token 
      });
      reply.code(403).send('Forbidden');
    }
  } catch (error) {
    logError(error, 'webhook verification');
    reply.code(500).send('Internal Server Error');
  }
}

// Procesamiento de mensajes entrantes (POST request)
export async function webhookHandler(
  request: FastifyRequest<{ Body: WhatsAppWebhookBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    logRequest(request);
    
    const body = request.body;

    // Validar estructura del webhook
    if (!body || !body.entry || !Array.isArray(body.entry)) {
      logger.warn('Invalid webhook body structure');
      reply.code(400).send('Bad Request');
      return;
    }

    logger.info('Processing webhook:', { 
      entriesCount: body.entry.length,
      object: body.object 
    });

    // Procesar cada entrada del webhook
    for (const entry of body.entry) {
      await processWebhookEntry(entry);
    }

    // Responder inmediatamente a Meta (importante)
    reply.code(200).send('OK');

  } catch (error) {
    logError(error, 'webhook handler');
    // Importante: siempre responder 200 para evitar reenvíos
    reply.code(200).send('Error processed');
  }
}

// Procesar una entrada individual del webhook
async function processWebhookEntry(entry: any): Promise<void> {
  try {
    if (!entry.changes || !Array.isArray(entry.changes)) {
      return;
    }

    for (const change of entry.changes) {
      if (change.field !== 'messages') {
        continue;
      }

      const value = change.value;
      
      // Procesar mensajes entrantes
      if (value.messages && Array.isArray(value.messages)) {
        for (const message of value.messages) {
          await processIncomingMessage(message);
        }
      }
      
      // Procesar updates de estado (opcional)
      if (value.statuses && Array.isArray(value.statuses)) {
        for (const status of value.statuses) {
          logger.info('Message status update:', {
            messageId: status.id,
            status: status.status,
            recipient: status.recipient_id
          });
        }
      }
    }
  } catch (error) {
    logError(error, 'processing webhook entry');
  }
}

// Procesar mensaje entrante individual
async function processIncomingMessage(message: WhatsAppMessage): Promise<void> {
  try {
    logger.info('Processing incoming message:', {
      from: message.from,
      type: message.type,
      messageId: message.id,
      timestamp: message.timestamp
    });

    // Solo procesar mensajes de texto por ahora
    if (message.type === 'text' && message.text?.body) {
      await messageHandler.processTextMessage(message.from, message.text.body);
    } else {
      logger.info(`Unsupported message type: ${message.type}`, {
        from: message.from,
        messageId: message.id
      });
      
      // Responder que no soportamos ese tipo de mensaje aún
      await whatsappService.sendMessage(
        message.from,
        "Por ahora solo puedo procesar mensajes de texto. ¡Pronto soportaré imágenes y otros tipos! 🤖"
      );
    }
  } catch (error) {
    logError(error, 'processing incoming message');
  }
}
