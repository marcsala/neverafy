import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Importamos la LandingPage que habíamos creado
import { LandingPage } from './features/landing'

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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/register" element={<SimpleRegisterPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
