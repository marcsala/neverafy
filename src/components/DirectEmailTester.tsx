// ===============================================
// CLIENT-SIDE EMAIL TESTER
// Test directo desde el cliente (solo para desarrollo)
// ===============================================

import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader, Zap } from 'lucide-react';

const DirectEmailTester = ({ userEmail, userName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testEmail, setTestEmail] = useState(userEmail || '');
  const [showLogs, setShowLogs] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const testDirectResend = async () => {
    if (!testEmail) {
      setResult({ type: 'error', message: 'Por favor ingresa un email' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setApiLogs([]);
    setShowLogs(true);

    try {
      addLog('🚀 Iniciando test de emails...', 'info');
      addLog(`📧 Email destino: ${testEmail}`, 'info');

      // En producción, usar las APIs de Vercel
      if (window.location.hostname !== 'localhost') {
        addLog('🌐 Modo producción - Usando API de Vercel', 'info');
        
        const response = await fetch('/api/test-email-simple', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testEmail,
            userName: userName || 'Usuario'
          })
        });

        addLog(`📡 Response status: ${response.status}`, response.ok ? 'success' : 'error');
        
        const responseText = await response.text();
        addLog(`📡 Response body: ${responseText}`, 'info');

        if (response.ok) {
          const data = JSON.parse(responseText);
          if (data.success) {
            addLog(`✅ Email enviado exitosamente! ID: ${data.emailId}`, 'success');
            setResult({
              type: 'success',
              message: `¡Email enviado exitosamente a ${testEmail}!`,
              details: `ID: ${data.emailId} - Revisa tu bandeja de entrada`
            });
          } else {
            addLog(`❌ Error: ${data.error}`, 'error');
            setResult({
              type: 'error',
              message: 'Error enviando email',
              details: data.error
            });
          }
        } else {
          addLog(`❌ Error HTTP: ${response.status}`, 'error');
          setResult({
            type: 'error',
            message: 'Error de servidor',
            details: responseText
          });
        }
        return;
      }

      // Modo desarrollo - Test directo (solo para localhost)
      addLog('🛠️ Modo desarrollo - Test directo con Resend', 'info');

      // HTML simple para prueba
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Direct - Neverafy</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
        <h1 style="margin: 0; font-size: 24px;">🥬 Neverafy Test Directo</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Test desde el cliente</p>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <h2>¡Hola ${userName || 'Usuario'}! 👋</h2>
        <p>Este es un test directo del sistema de emails de Neverafy.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #c05621; margin: 0 0 15px 0;">⏰ Test de productos:</h3>
            <div style="padding: 10px; background: #fee2e2; border-left: 4px solid #ef4444; margin: 10px 0;">
                🥛 <strong>Leche</strong> - Vence HOY 🚨
            </div>
            <div style="padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; margin: 10px 0;">
                🍌 <strong>Plátanos</strong> - Vence MAÑANA ⚠️
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/dashboard" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                🥬 Ver Mi Nevera
            </a>
        </div>
        
        <div style="background: #e6fffa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #234e52; margin: 0 0 10px 0;">🌍 Tu impacto (demo):</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                <div style="text-align: center; margin: 10px;">
                    <div style="font-size: 24px; font-weight: bold; color: #2c7a7b;">€47</div>
                    <div style="color: #4a5568; font-size: 14px;">Ahorrados</div>
                </div>
                <div style="text-align: center; margin: 10px;">
                    <div style="font-size: 24px; font-weight: bold; color: #2c7a7b;">12kg</div>
                    <div style="color: #4a5568; font-size: 14px;">CO₂ evitado</div>
                </div>
                <div style="text-align: center; margin: 10px;">
                    <div style="font-size: 24px; font-weight: bold; color: #2c7a7b;">450</div>
                    <div style="color: #4a5568; font-size: 14px;">Puntos</div>
                </div>
            </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            Neverafy - Tu nevera inteligente<br>
            <small>Test directo enviado el ${new Date().toLocaleString('es-ES')}</small>
        </p>
    </div>
</body>
</html>
      `;

      addLog('📄 HTML generado correctamente', 'info');

      // API Key hardcodeada para test (normalmente sería mala práctica, pero es solo para debugging)
      const RESEND_API_KEY = 're_[TU_API_KEY_AQUI]';
      
      addLog('🔑 Usando API key configurada', 'info');

      const payload = {
        from: 'Neverafy <onboarding@resend.dev>',
        to: [testEmail],
        subject: '🧪 Test Directo - Neverafy',
        html: emailHtml,
      };

      addLog('📦 Payload preparado', 'info');
      addLog('📡 Enviando request directo a Resend...', 'info');

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      addLog(`📡 Response status: ${response.status}`, response.ok ? 'success' : 'error');

      const responseText = await response.text();
      addLog(`📡 Response body: ${responseText}`, 'info');

      if (response.ok) {
        const result = JSON.parse(responseText);
        addLog(`✅ Email enviado exitosamente! ID: ${result.id}`, 'success');
        
        setResult({
          type: 'success',
          message: `¡Email enviado exitosamente a ${testEmail}!`,
          details: `ID: ${result.id} - Revisa tu bandeja de entrada`
        });
      } else {
        addLog(`❌ Error de Resend: ${responseText}`, 'error');
        
        let errorDetails = responseText;
        try {
          const errorJson = JSON.parse(responseText);
          errorDetails = errorJson.message || errorJson.error || responseText;
          addLog(`❌ Error parseado: ${errorDetails}`, 'error');
        } catch (e) {
          addLog(`❌ No se pudo parsear error`, 'error');
        }
        
        setResult({
          type: 'error',
          message: 'Error enviando email',
          details: errorDetails
        });
      }

    } catch (error) {
      addLog(`💥 Error de conexión: ${error.message}`, 'error');
      setResult({
        type: 'error',
        message: 'Error de conexión',
        details: error.message
      });
    } finally {
      addLog('🏁 Test completado', 'info');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Test Directo de Emails</h3>
          <p className="text-sm text-gray-500">Bypass de las APIs - Test directo con Resend</p>
        </div>
      </div>

      {/* Input para email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email de prueba:
        </label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {/* Botón de acción */}
      <div className="mb-6">
        <button
          onClick={testDirectResend}
          disabled={isLoading || !testEmail}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Test Directo con Resend
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div className={`p-4 rounded-lg border mb-6 ${
          result.type === 'success' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                result.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </p>
              {result.details && (
                <p className={`text-sm mt-1 ${
                  result.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.details}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logs detallados */}
      {showLogs && apiLogs.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">🔍 Logs del test directo:</h4>
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            {apiLogs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                <span className="text-gray-400">[{log.timestamp}]</span>
                <span className={`ml-2 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>⚡ Test Directo:</strong> Este test bypasea las Vercel Functions y llama directamente a la API de Resend desde el cliente. Solo para debugging.
        </p>
      </div>
    </div>
  );
};

export default DirectEmailTester;
