// src/api/webhooks/bizum.ts
import { PaymentsService } from '../../services/payments.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { MetricsService } from '../../services/metrics.service';
import { UsersService } from '../../services/users.service';

export default async function handler(req: Request) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    console.log('Bizum webhook received:', JSON.stringify(body, null, 2));

    // Validar payload básico
    if (!body.phoneNumber || !body.amount || !body.concept) {
      console.error('Invalid webhook payload:', body);
      return new Response('Invalid payload', { status: 400 });
    }

    // Inicializar servicios
    const whatsappService = new WhatsAppService();
    const metricsService = new MetricsService();
    const usersService = new UsersService();
    const paymentsService = new PaymentsService(
      whatsappService,
      metricsService,
      usersService
    );

    // Procesar pago
    await paymentsService.processBizumWebhook({
      phoneNumber: body.phoneNumber,
      amount: parseFloat(body.amount),
      concept: body.concept,
      reference: body.reference || `bizum_${Date.now()}`,
      timestamp: body.timestamp || new Date().toISOString(),
      transactionId: body.transactionId || body.id || `tx_${Date.now()}`
    });

    console.log('Bizum payment processed successfully');
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Bizum webhook error:', error);
    
    // Log error para debugging pero no fallar el webhook
    return new Response('Internal error', { status: 500 });
  }
}

// Función helper para testing manual (development only)
export async function testBizumPayment(phoneNumber: string, amount: number, userCode: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Test function not available in production');
  }

  const testPayload = {
    phoneNumber,
    amount,
    concept: `PREMIUM-${userCode}`,
    reference: `test_${Date.now()}`,
    timestamp: new Date().toISOString(),
    transactionId: `test_tx_${Date.now()}`
  };

  const response = await fetch('/api/webhooks/bizum', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  return {
    success: response.ok,
    status: response.status,
    payload: testPayload
  };
}
