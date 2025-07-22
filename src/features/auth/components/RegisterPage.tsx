import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await signUp(email, password);
      setMessage('¡Cuenta creada exitosamente! Revisa tu email para confirmar.');
      // Redirigir al login después del registro
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center p-6">
      {/* Back to landing */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <span>←</span>
        <span>Volver al inicio</span>
      </Link>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/30">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-5xl">🥬</span>
            <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Neverafy
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">¡Únete gratis!</h1>
          <p className="text-gray-600">Crea tu cuenta en menos de 2 minutos</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              Acepto los{' '}
              <a href="#" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                política de privacidad
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:scale-105"
          >
            {loading ? 'Creando cuenta...' : '🚀 Crear Cuenta Gratis'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
              Inicia sesión
            </Link>
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>✓</span>
              <span>Gratis para siempre</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>🔒</span>
              <span>Sin tarjeta de crédito</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;