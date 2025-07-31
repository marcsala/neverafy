// ===============================================
// API ENDPOINT - TEST EMAIL
// Para probar el sistema de emails manualmente
// ===============================================

import { createEmailTemplate } from '../../src/services/email/emailTemplate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { email, userName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    console.log(`📧 Enviando email de prueba a: ${email}`);

    // Datos de prueba
    const testProducts = [
      {
        name: 'Leche semidesnatada',
        category: 'lácteos',
        expiry_date: new Date().toISOString().split('T')[0], // Hoy
        quantity: 1
      },
      {
        name: 'Plátanos',
        category: 'frutas',
        expiry_date: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // Mañana
        quantity: 6
      },
      {
        name: 'Pan integral',
        category: 'pan',
        expiry_date: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0], // Pasado mañana
        quantity: 1
      }
    ];

    const testUserStats = {
      total_saved: 47,
      co2_saved: 12,
      points: 450
    };

    // Crear el HTML del email
    const emailHtml = createEmailTemplate({
      userName: userName || 'Marc',
      products: testProducts,
      userStats: testUserStats,
      appUrl: process.env.VITE_APP_URL || 'http://localhost:5173',
      unsubscribeUrl: `${process.env.VITE_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`
    });

    // Enviar email con Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neverafy <onboarding@resend.dev>',
        to: [email],
        subject: '🧪 Email de Prueba - Neverafy',
        html: emailHtml,
      }),
    });

    if (resendResponse.ok) {
      const result = await resendResponse.json();
      console.log(`✅ Email de prueba enviado exitosamente (ID: ${result.id})`);
      
      return res.status(200).json({
        success: true,
        message: `Email de prueba enviado a ${email}`,
        emailId: result.id
      });
    } else {
      const errorText = await resendResponse.text();
      console.error('❌ Error enviando email:', errorText);
      
      return res.status(500).json({
        success: false,
        error: 'Error enviando email',
        details: errorText
      });
    }

  } catch (error) {
    console.error('💥 Error en test-email:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}
