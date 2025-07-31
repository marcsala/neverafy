// ===============================================
// DEBUG HELPER - Para debuggear el sistema de emails
// ===============================================

import React, { useState } from 'react';
import { Bug, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const EmailDebugger = ({ userEmail, userName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testEmail, setTestEmail] = useState(userEmail || '');
  const [showLogs, setShowLogs] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const testEmailDebug = async () => {
    if (!testEmail) {
      setResult({ type: 'error', message: 'Por favor ingresa un email' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setApiLogs([]);
    setShowLogs(true);

    try {
      addLog('🚀 Iniciando prueba de email...', 'info');
      addLog(`📧 Email destino: ${testEmail}`, 'info');
      addLog(`👤 Usuario: ${userName || 'Usuario'}`, 'info');

      // Test 1: Verificar que la API existe
      addLog('🔍 Verificando endpoint /api/test-email-simple...', 'info');
      
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
      addLog(`📡 Response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`, 'info');

      const responseText = await response.text();
      addLog(`📡 Response body (raw): ${responseText}`, 'info');

      let data;
      try {
        data = JSON.parse(responseText);
        addLog(`📊 Parsed JSON: ${JSON.stringify(data, null, 2)}`, 'info');
      } catch (parseError) {
        addLog(`❌ Error parsing JSON: ${parseError.message}`, 'error');
        setResult({
          type: 'error',
          message: 'Error parsing response',
          details: `Raw response: ${responseText}`
        });
        return;
      }

      if (data.success) {
        addLog('✅ Email enviado exitosamente!', 'success');
        setResult({
          type: 'success',
          message: `¡Email enviado exitosamente a ${testEmail}!`,
          details: `ID: ${data.emailId}`
        });
      } else {
        addLog(`❌ Error en el envío: ${data.error}`, 'error');
        if (data.details) {
          addLog(`❌ Detalles: ${data.details}`, 'error');
        }
        setResult({
          type: 'error',
          message: 'Error enviando email',
          details: data.error + (data.details ? ` - ${data.details}` : '')
        });
      }

    } catch (error) {
      addLog(`💥 Error de conexión: ${error.message}`, 'error');
      addLog(`💥 Stack trace: ${error.stack}`, 'error');
      
      setResult({
        type: 'error',
        message: 'Error de conexión',
        details: error.message
      });
    } finally {
      addLog('🏁 Proceso terminado', 'info');
      setIsLoading(false);
    }
  };

  // Test directo de variables de entorno
  const testEnvVars = async () => {
    addLog('🔧 Verificando variables de entorno desde cliente...', 'info');
    addLog(`VITE_APP_URL: ${import.meta.env.VITE_APP_URL || 'no definida'}`, 'info');
    
    try {
      const response = await fetch('/api/debug-env', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        addLog(`Variables del servidor: ${JSON.stringify(data, null, 2)}`, 'info');
      } else {
        addLog('❌ No se pudo verificar variables del servidor', 'error');
      }
    } catch (error) {
      addLog(`Error verificando env vars: ${error.message}`, 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Bug className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Debug de Emails</h3>
          <p className="text-sm text-gray-500">Debuggeo detallado del sistema</p>
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
          onClick={testEmailDebug}
          disabled={isLoading || !testEmail}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Bug className="w-4 h-4" />
          )}
          Debug Email Test
        </button>

        <button
          onClick={testEnvVars}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          Test Env Vars
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
                <p className={`text-sm mt-1 font-mono ${
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
      {showLogs && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">🔍 Logs detallados:</h4>
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
    </div>
  );
};

export default EmailDebugger;
