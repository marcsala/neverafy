// ===============================================
// COMPONENTE PARA TESTING DE EMAILS - NEVERAFY
// ===============================================

import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const EmailTester = ({ userEmail, userName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testEmail, setTestEmail] = useState(userEmail || '');

  const sendTestEmail = async () => {
    if (!testEmail) {
      setResult({ type: 'error', message: 'Por favor ingresa un email' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log('📧 Enviando email de prueba...');
      
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          userName: userName || 'Usuario'
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          type: 'success',
          message: `¡Email enviado exitosamente a ${testEmail}!`,
          details: `ID: ${data.emailId}`
        });
      } else {
        setResult({
          type: 'error',
          message: 'Error enviando email',
          details: data.error
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setResult({
        type: 'error',
        message: 'Error de conexión',
        details: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDailyNotifications = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🔄 Ejecutando proceso de notificaciones diarias...');
      
      const response = await fetch('/api/daily-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          type: 'success',
          message: `Proceso completado: ${data.emailsSent} emails enviados`,
          details: `${data.totalUsers} usuarios, ${data.totalProducts} productos`
        });
      } else {
        setResult({
          type: 'error',
          message: 'Error en proceso diario',
          details: data.error
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setResult({
        type: 'error',
        message: 'Error de conexión',
        details: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Test de Emails</h3>
          <p className="text-sm text-gray-500">Prueba el sistema de notificaciones</p>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={sendTestEmail}
          disabled={isLoading || !testEmail}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Enviar Email de Prueba
        </button>

        <button
          onClick={testDailyNotifications}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          Test Notificaciones Diarias
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div className={`p-4 rounded-lg border ${
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

      {/* Información adicional */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">📋 Información del sistema:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Email de prueba:</strong> Envía un email con datos ficticios</li>
          <li>• <strong>Notificaciones diarias:</strong> Ejecuta el cron job manualmente</li>
          <li>• <strong>Horario automático:</strong> Todos los días a las 9:00 AM</li>
          <li>• <strong>Límite gratuito:</strong> 3,000 emails/mes con Resend</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTester;
