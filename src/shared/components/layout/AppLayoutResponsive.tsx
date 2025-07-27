import React, { useState, useEffect } from 'react';
import { MobileLayout } from '@/shared/components/mobile';
import { MobileDashboard } from '@/features/dashboard-mobile';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import AppRoutes from './AppRoutes';
import NavBar from './NavBar';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      setIsMobile(width <= 768 || mobileKeywords.test(userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calcular productos urgentes para notificaciones
  const urgentProducts = products.filter(p => {
    const daysToExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 1;
  });

  // Renderizar versión mobile
  if (isMobile) {
    return (
      <MobileLayout
        user={userStats}
        urgentCount={urgentProducts.length}
        currentView={currentView}
        onViewChange={setCurrentView}
      >
        {currentView === 'dashboard' && (
          <MobileDashboard
            userStats={userStats}
            products={products}
            notifications={notifications}
            setCurrentView={setCurrentView}
            productActions={productActions}
          />
        )}
        
        {/* Aquí puedes añadir otras vistas móviles */}
        {currentView === 'camera' && (
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-4">📸 Cámara OCR</h2>
            <p className="text-gray-600">Funcionalidad de cámara próximamente...</p>
          </div>
        )}
        
        {currentView === 'recipes' && (
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-4">🍳 Recetas</h2>
            <p className="text-gray-600">Recetas inteligentes próximamente...</p>
          </div>
        )}
        
        {currentView === 'profile' && (
          <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-4">👤 Perfil</h2>
            <p className="text-gray-600">Configuración de perfil próximamente...</p>
          </div>
        )}
      </MobileLayout>
    );
  }

  // Renderizar versión desktop (layout original)
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