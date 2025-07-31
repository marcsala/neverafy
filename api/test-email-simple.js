// ===============================================
// API ENDPOINT - TEST EMAIL (SIMPLIFIED)
// Versión simplificada para debuggear el error
// ===============================================

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

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        details: `Email recibido: "${email}"`
      });
    }

    console.log(`📧 Enviando email de prueba a: ${email}`);
    console.log(`👤 Usuario: ${userName || 'Usuario'}`);
    console.log(`🔑 RESEND_API_KEY exists: ${!!process.env.RESEND_API_KEY}`);
    console.log(`🔑 RESEND_API_KEY length: ${process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0}`);

    // HTML simple para prueba
    const simpleHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Email - Neverafy</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
        <h1 style="margin: 0; font-size: 24px;">🥬 Neverafy Test</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Email de prueba del sistema</p>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <h2>¡Hola ${userName || 'Usuario'}! 👋</h2>
        <p>Este es un email de prueba del sistema de notificaciones de Neverafy.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #c05621; margin: 0 0 15px 0;">⏰ Productos de prueba:</h3>
            <div style="padding: 10px; background: #f0f9ff; border-left: 4px solid #3b82f6; margin: 10px 0;">
                🥛 <strong>Leche</strong> - Vence HOY
            </div>
            <div style="padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 10px 0;">
                🍌 <strong>Plátanos</strong> - Vence MAÑANA
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.VITE_APP_URL || 'http://localhost:5173'}/dashboard" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                🥬 Ver Mi Nevera
            </a>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            Neverafy - Tu nevera inteligente<br>
            <small>Email de prueba enviado el ${new Date().toLocaleString('es-ES')}</small>
        </p>
    </div>
</body>
</html>
    `;

    console.log('📄 HTML generado correctamente');

    // Preparar el payload para Resend
    const payload = {
      from: 'Neverafy <onboarding@resend.dev>',
      to: [email],
      subject: '🧪 Test Email - Neverafy',
      html: simpleHtml,
    };

    console.log('📦 Payload preparado:', JSON.stringify({
      ...payload,
      html: '[HTML content]' // No logear el HTML completo
    }, null, 2));

    // Enviar email con Resend
    console.log('📡 Enviando request a Resend...');
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`📡 Resend response status: ${resendResponse.status}`);
    console.log(`📡 Resend response ok: ${resendResponse.ok}`);

    const responseText = await resendResponse.text();
    console.log(`📡 Resend response body: ${responseText}`);

    if (resendResponse.ok) {
      const result = JSON.parse(responseText);
      console.log(`✅ Email enviado exitosamente (ID: ${result.id})`);
      
      return res.status(200).json({
        success: true,
        message: `Email de prueba enviado a ${email}`,
        emailId: result.id,
        debug: {
          resendStatus: resendResponse.status,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.error('❌ Error enviando email:', responseText);
      
      // Intentar parsear el error de Resend
      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = errorJson.message || errorJson.error || responseText;
      } catch (e) {
        // Si no se puede parsear, usar el texto crudo
      }
      
      return res.status(500).json({
        success: false,
        error: 'Error enviando email',
        details: errorDetails,
        debug: {
          resendStatus: resendResponse.status,
          resendStatusText: resendResponse.statusText,
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('💥 Error general en test-email:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      message: error.message,
      stack: error.stack,
      debug: {
        timestamp: new Date().toISOString()
      }
    });
  }
}
