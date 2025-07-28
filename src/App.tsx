import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Nueva landing page moderna
import LandingPageModern from './LandingPageModern';
import { CleanLoginPage, CleanRegisterPage } from './components/CleanAuthPages';
import DashboardComponent from './components/Dashboard';

// Hooks (mantener los existentes si están disponibles)
// import { useAppHooks, useAppHandlers } from '@/shared/hooks';

// Components (componentes de carga si están disponibles)
// import { LoadingScreen } from '@/shared/components/ui';

const App: React.FC = () => {
  // Simulamos estado básico - aquí puedes integrar con tus hooks existentes
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  
  // Estado básico para el dashboard
  const [userName] = React.useState('Usuario');

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
        
        {/* Ruta del dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardComponent
              userName={userName}
              // userStats={userStats}
              // stats={stats}
              // notifications={notifications}
              // products={products}
              // productActions={productActions}
            />
          } 
        />
        
        {/* Rutas protegidas - solo si hay sesión */}
        <Route 
          path="/*" 
          element={
            session ? (
              <DashboardComponent
                userName={userName}
                // userStats={userStats}
                // stats={stats}
                // notifications={notifications}
                // products={products}
                // productActions={productActions}
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