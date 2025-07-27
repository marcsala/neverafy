import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Hooks
import { useAppHooks, useAppHandlers } from '@/shared/hooks';

// Components
import { LoadingScreen } from '@/shared/components/ui';
import AppLayoutResponsive from '@/shared/components/layout/AppLayoutResponsive';
import { LandingPage } from '@/features/landing';
import { LoginPage, RegisterPage } from '@/features/auth';

const App: React.FC = () => {
  // Consolidar todos los hooks de la app
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

  // Handlers de la app
  const { handleLogout, handleUpgradeToPremium } = useAppHandlers({
    signOut,
    setIsPremium
  });

  // Estados de carga
  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas protegidas - solo si hay sesión */}
        <Route 
          path="/*" 
          element={
            session ? (
              <AppLayoutResponsive
                userStats={userStats}
                isPremium={isPremium}
                currentView={currentView}
                stats={stats}
                notifications={notifications}
                products={products}
                setCurrentView={setCurrentView}
                setIsPremium={setIsPremium}
                handleLogout={handleLogout}
                productActions={productActions}
                ocrLogic={ocrLogic}
                recipeLogic={recipeLogic}
                handleUpgradeToPremium={handleUpgradeToPremium}
              />
            ) : (
              <LoginPage />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
