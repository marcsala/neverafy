import { whatsappConfig } from '../config/whatsapp';
import { SendMessageRequest, SendMessageResponse } from '../types/whatsapp.types';
import { logger } from '../utils/logger';

export class WhatsAppService {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${whatsappConfig.baseUrl}/${whatsappConfig.apiVersion}/${whatsappConfig.phoneNumberId}`;
    this.headers = {
      'Authorization': `Bearer ${whatsappConfig.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const requestBody: SendMessageRequest = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      };

      logger.info(`Sending message to ${to}:`, { messageLength: message.length });

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`WhatsApp API error:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        return false;
      }

      const responseData = await response.json() as SendMessageResponse;
      
      logger.info(`Message sent successfully:`, {
        messageId: responseData.messages[0]?.id,
        to: to
      });

      return true;

    } catch (error) {
      logger.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendTypingIndicator(to: string): Promise<void> {
    try {
      // Simular que el bot está escribiendo (opcional)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error('Error sending typing indicator:', error);
    }
  }

  // Método para validar números de teléfono
  isValidPhoneNumber(phoneNumber: string): boolean {
    // Formato internacional sin + (ej: 34666123456)
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phoneNumber);
  }

  // Formatear número de teléfono
  formatPhoneNumber(phoneNumber: string): string {
    // Remover espacios, guiones y caracteres especiales
    return phoneNumber.replace(/[\s\-\(\)\+]/g, '');
  }
}
