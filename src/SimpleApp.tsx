import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple landing page component
const SimpleLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🥬</div>
        <h1 className="text-4xl font-bold mb-4">Neverafy</h1>
        <p className="text-xl text-gray-600 mb-8">Tu nevera, inteligente</p>
        <p className="text-lg text-gray-500 mb-8">250€ de comida a la basura cada año</p>
        <div className="space-x-4">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </a>
          <a 
            href="/register" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Empezar Gratis
          </a>
        </div>
        <div className="mt-8 space-x-4 text-sm text-gray-500">
          <a href="/roadmap" className="hover:text-gray-700">Roadmap</a>
          <a href="/privacy" className="hover:text-gray-700">Privacidad</a>
          <a href="/terms" className="hover:text-gray-700">Términos</a>
        </div>
      </div>
    </div>
  );
};

// Simple login page
const SimpleLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🥬</div>
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
        </div>
        <form className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border rounded-lg"
          />
          <button 
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Entrar
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/" className="text-blue-600 hover:underline">← Volver a inicio</a>
        </div>
      </div>
    </div>
  );
};

// Simple register page
const SimpleRegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🥬</div>
          <h2 className="text-2xl font-bold">Crear Cuenta</h2>
        </div>
        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre" 
            className="w-full p-3 border rounded-lg"
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border rounded-lg"
          />
          <button 
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Crear Cuenta
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/" className="text-blue-600 hover:underline">← Volver a inicio</a>
        </div>
      </div>
    </div>
  );
};

const SimpleApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleLandingPage />} />
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/register" element={<SimpleRegisterPage />} />
        <Route path="*" element={<SimpleLandingPage />} />
      </Routes>
    </Router>
  );
};

export default SimpleApp;
