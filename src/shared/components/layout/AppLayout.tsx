import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import AppRoutes from './AppRoutes';
import { NavBar } from './NavBar';

interface AppLayoutProps {
  // Data
  userStats: any;
  isPremium: boolean;
  currentView: string;
  
  // App routes props
  stats: any;
  notifications: any[];
  products: any[];
  
  // Handlers
  setCurrentView: (view: string) => void;
  setIsPremium: (premium: boolean) => void;
  handleLogout: () => void;
  
  // Actions
  productActions: any;
  ocrLogic: any;
  recipeLogic: any;
  handleUpgradeToPremium: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  userStats,
  isPremium,
  currentView,
  stats,
  notifications,
  products,
  setCurrentView,
  setIsPremium,
  handleLogout,
  productActions,
  ocrLogic,
  recipeLogic,
  handleUpgradeToPremium
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AppHeader userStats={userStats} isPremium={isPremium} />

        {/* Navigation */}
        <NavBar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isPremium={isPremium}
          userStats={userStats}
          onLogout={handleLogout}
        />

        {/* Routes */}
        <AppRoutes
          stats={stats}
          userStats={userStats}
          notifications={notifications}
          products={products}
          isPremium={isPremium}
          setCurrentView={setCurrentView}
          setIsPremium={setIsPremium}
          addProduct={productActions.addProduct}
          markAsConsumed={productActions.markAsConsumed}
          removeProduct={productActions.removeProduct}
          addDetectedProduct={productActions.addDetectedProduct}
          ocrLogic={ocrLogic}
          recipeLogic={recipeLogic}
          handleUpgradeToPremium={handleUpgradeToPremium}
        />

        {/* Footer */}
        <AppFooter userStats={userStats} />
      </div>
    </div>
  );
};

export default AppLayout;