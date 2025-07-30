import dotenv from 'dotenv';
dotenv.config();

export const whatsappConfig = {
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN!,
  apiVersion: 'v18.0',
  baseUrl: 'https://graph.facebook.com'
};

// Validar configuración al inicio
export function validateWhatsAppConfig(): void {
  if (!whatsappConfig.accessToken) {
    throw new Error('WHATSAPP_ACCESS_TOKEN is required');
  }
  if (!whatsappConfig.phoneNumberId) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID is required');  
  }
  if (!whatsappConfig.webhookVerifyToken) {
    throw new Error('WHATSAPP_WEBHOOK_VERIFY_TOKEN is required');
  }
}
