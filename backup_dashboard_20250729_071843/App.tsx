import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSupabaseAuth } from './shared/hooks/useSupabase';

// Landing page moderna
import LandingPageModern from './LandingPageModern';
import { CleanLoginPage, CleanRegisterPage } from './components/CleanAuthPages';
import RoadmapPage from './components/RoadmapPage';

// 🆕 Usar el Dashboard refactorizado
import Dashboard from './features/dashboard/components/DashboardRefactored';

// 🆕 Componente de loading mejorado
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">Cargando Neverafy...</p>
      <p className="text-gray-400 text-sm mt-1">Preparando tu nevera inteligente</p>
    </div>
  </div>
);

// 🆕 Componente de error
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      {children}
    </React.Suspense>
  );
};

const App: React.FC = () => {
  // Autenticación de Supabase
  const { user, session, loading, isAuthenticated } = useSupabaseAuth();
  
  // Datos del usuario
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';
  const userId = user?.id;

  // Loading screen con mejores UX
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* 🏠 Rutas públicas */}
          <Route path="/" element={<LandingPageModern />} />
          <Route path="/login" element={<CleanLoginPage />} />
          <Route path="/register" element={<CleanRegisterPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          
          {/* 🔐 Ruta principal del dashboard */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard
                  userName={userName}
                  userId={userId}
                />
              ) : (
                <CleanLoginPage />
              )
            } 
          />
          
          {/* 🔐 Rutas protegidas - redirigir todo al dashboard si está autenticado */}
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <Dashboard
                  userName={userName}
                  userId={userId}
                />
              ) : (
                <LandingPageModern />
              )
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;