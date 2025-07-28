import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSupabaseAuth } from './shared/hooks/useSupabase';

// Nueva landing page moderna
import LandingPageModern from './LandingPageModern';
import { CleanLoginPage, CleanRegisterPage } from './components/CleanAuthPages';
import DashboardComponent from './components/Dashboard';
import RoadmapPage from './components/RoadmapPage';

// Hooks (mantener los existentes si están disponibles)
// import { useAppHooks, useAppHandlers } from '@/shared/hooks';

// Components (componentes de carga si están disponibles)
// import { LoadingScreen } from '@/shared/components/ui';

const App: React.FC = () => {
  // Usar autenticación real de Supabase
  const { user, session, loading, isAuthenticated } = useSupabaseAuth();
  
  // Estado básico para el dashboard
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';

  // Loading screen mientras se carga la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si tienes hooks disponibles, puedes descomentar esto:
  /*
  const {
    session,
    loading,
    signOut,
    currentView,
    userStats,
    notifications,
    products,
    isPremium,
    setCurrentView,
    setIsPremium,
    productActions,
    ocrLogic,
    recipeLogic,
    stats
  } = useAppHooks();

  const { handleLogout, handleUpgradeToPremium } = useAppHandlers({
    signOut,
    setIsPremium
  });
  */

  // Estados de carga - descomenta si tienes LoadingScreen
  // if (loading) return <LoadingScreen />;

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPageModern />} />
        <Route path="/login" element={<CleanLoginPage />} />
        <Route path="/register" element={<CleanRegisterPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        
        {/* Ruta del dashboard */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <DashboardComponent
                userName={userName}
                userId={user?.id}
              />
            ) : (
              <CleanLoginPage />
            )
          } 
        />
        
        {/* Rutas protegidas - solo si hay sesión */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <DashboardComponent
                userName={userName}
                userId={user?.id}
              />
            ) : (
              <CleanLoginPage />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;