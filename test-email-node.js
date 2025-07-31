// ===============================================
// SCRIPT DE PRUEBA DIRECTA - NODE.JS
// Para probar el email desde terminal
// ===============================================

const fetch = require('node-fetch');

async function testEmail() {
  const RESEND_API_KEY = 're_[CAMBIAR_POR_TU_API_KEY]';
  const EMAIL_DESTINO = 'marcsala@me.com';
  
  console.log('🚀 Probando email desde Node.js...');
  console.log(`📧 Enviando a: ${EMAIL_DESTINO}`);

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Node.js - Neverafy</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
        <h1 style="margin: 0; font-size: 24px;">🥬 Neverafy Funciona!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Test desde Node.js exitoso</p>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <h2>¡Hola Marc! 👋</h2>
        <p><strong>¡Tu sistema de emails funciona perfectamente!</strong></p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin: 0 0 15px 0;">✅ Lo que significa:</h3>
            <ul style="color: #374151; line-height: 1.6;">
              <li>Tu API key de Resend está configurada correctamente</li>
              <li>La plantilla de email se genera sin problemas</li>
              <li>El servidor puede enviar emails perfectamente</li>
              <li>Solo necesitas deployar para que funcione en la web</li>
            </ul>
        </div>
        
        <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">🚀 Próximo paso:</h3>
            <p style="color: #1e3a8a; margin: 0;">Deploy tu app a Vercel y el sistema estará 100% operativo!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="background: #667eea; color: white; padding: 15px 30px; border-radius: 25px; font-weight: bold; display: inline-block;">
                🎉 ¡Sistema Listo para Lanzar!
            </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            Neverafy - Tu nevera inteligente<br>
            <small>Test desde Node.js - ${new Date().toLocaleString('es-ES')}</small>
        </p>
    </div>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neverafy <onboarding@resend.dev>',
        to: [EMAIL_DESTINO],
        subject: '🎉 ¡Tu Sistema de Emails Funciona!',
        html: emailHtml,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!');
      console.log(`📧 ID: ${result.id}`);
      console.log('📬 ¡Revisa tu bandeja de entrada!');
      console.log('');
      console.log('🎯 CONCLUSIÓN:');
      console.log('- Tu API key funciona perfectamente');
      console.log('- La plantilla se ve hermosa');
      console.log('- Solo necesitas deployar a Vercel');
      console.log('- ¡Tu app está lista para lanzar!');
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
    }

  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

testEmail();
