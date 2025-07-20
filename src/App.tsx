import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Hooks
import { useAppHooks, useAppHandlers } from './shared/hooks';

// Components
import { LoadingScreen } from './shared/components/ui';
import { AppLayout } from './shared/components/layout';
import { AuthForm } from './features/auth';

const FreshAlertPro: React.FC = () => {
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

  // Estados de carga y autenticación
  if (loading) return <LoadingScreen />;
  if (!session) return <AuthForm onAuthSuccess={() => {}} />;

  return (
    <Router>
      <AppLayout
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
    </Router>
  );
};

export default FreshAlertPro;