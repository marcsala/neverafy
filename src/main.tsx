import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Landing page autocontenida
import LandingPageComplete from './LandingPageComplete'

// Páginas simples de auth
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          <button 
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          <button 
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageComplete />} />
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/register" element={<SimpleRegisterPage />} />
        <Route path="*" element={<LandingPageComplete />} />
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
