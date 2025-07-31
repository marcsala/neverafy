// ===============================================
// API ENDPOINT - DEBUG ENV VARS
// Para debuggear variables de entorno
// ===============================================

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Verificar variables de entorno (sin exponer valores sensibles)
    const envCheck = {
      RESEND_API_KEY: {
        defined: !!process.env.RESEND_API_KEY,
        prefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 8) + '...' : 'undefined',
        length: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0
      },
      VITE_APP_URL: {
        defined: !!process.env.VITE_APP_URL,
        value: process.env.VITE_APP_URL || 'undefined'
      },
      NODE_ENV: {
        value: process.env.NODE_ENV || 'undefined'
      },
      // Test de conexión a Resend
      resendApiTest: 'pending'
    };

    // Test básico de la API de Resend
    try {
      const testResponse = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      envCheck.resendApiTest = {
        status: testResponse.status,
        ok: testResponse.ok,
        statusText: testResponse.statusText
      };

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        envCheck.resendApiTest.error = errorText;
      }

    } catch (resendError) {
      envCheck.resendApiTest = {
        error: resendError.message,
        type: 'connection_error'
      };
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck
    });

  } catch (error) {
    console.error('Error in debug-env:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}
