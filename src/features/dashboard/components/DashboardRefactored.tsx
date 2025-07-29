// =================================
// Dashboard Main Component (Final Refactored Version)
// =================================

import React from 'react';
import DashboardLayout from './DashboardLayout';
import UrgentAlerts from './UrgentAlerts';
import ProductsList from './ProductsList';
import AddProductModal from './AddProductModal';
import NotificationToast from './NotificationToast';
import MainActionButtons from './MainActionButtons';
import StatsGrid from './StatsGrid';
import { useDashboard } from '../hooks';
import type { DashboardProps } from '../types';

// Importar otros componentes de features
import FridgeView from '../../../components/FridgeView';
import ProfileView from '../../../components/ProfileView';
import RecipesIntegration from '../../../components/RecipesIntegration';

const Dashboard: React.FC<DashboardProps> = ({
  userName = 'Usuario',
  userId
}) => {
  // Hook principal que maneja TODO el estado y lógica
  const {
    // Estado de productos
    products,
    loading,
    error,
    
    // Estado de navegación
    currentView,
    
    // Estado responsive
    isMobile,
    
    // Estado de UI
    isModalOpen,
    
    // Notificaciones
    notification,
    
    // Análisis y estadísticas
    stats,
    urgentProducts,
    hasUrgentProducts,
    
    // Acciones de productos
    addProduct,
    
    // Acciones de navegación
    navigateTo,
    setCurrentView,
    
    // Acciones de UI
    openModal,
    closeModal,
    
    // Acciones de notificaciones
    showNotification,
    onNotificationClick
  } = useDashboard(userId);

  // Renderizar vistas específicas
  if (currentView === 'fridge') {
    return (
      <FridgeView
        products={products}
        onUpdateProducts={() => {}} // TODO: Implementar con el hook
        onBack={() => setCurrentView('dashboard')}
        isMobile={isMobile}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfileView
        onBack={() => setCurrentView('dashboard')}
        isMobile={isMobile}
        userName={userName}
        userEmail="usuario@neverafy.com"
      />
    );
  }

  if (currentView === 'recipes') {
    return (
      <div className="relative">
        {/* Botón de volver */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 bg-white shadow-md rounded-lg px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="m19 12-7 7-7-7"/>
            </svg>
            Volver al Dashboard
          </button>
        </div>
        
        <RecipesIntegration products={products} userId={userId} />
      </div>
    );
  }

  // Vista principal del dashboard
  return (
    <DashboardLayout
      isMobile={isMobile}
      userName={userName}
      currentView={currentView}
      onNavigate={navigateTo}
      onNotificationClick={onNotificationClick}
    >
      {/* Contenido principal */}
      <div className={`max-w-6xl mx-auto ${isMobile ? 'p-0' : 'p-6'}`}>
        <div className={isMobile ? 'space-y-6' : 'grid lg:grid-cols-3 gap-6'}>
          {/* Columna principal */}
          <div className={isMobile ? 'space-y-6' : 'lg:col-span-2 space-y-6'}>
            {/* Alertas urgentes */}
            {hasUrgentProducts && (
              <UrgentAlerts
                urgentProducts={urgentProducts}
                onViewRecipes={() => setCurrentView('recipes')}
                isMobile={isMobile}
              />
            )}

            {/* Lista de productos */}
            <ProductsList
              products={products}
              maxVisible={6}
              onViewAll={() => setCurrentView('fridge')}
              isMobile={isMobile}
            />
          </div>

          {/* Sidebar de acciones (Desktop) / Sección de acciones (Mobile) */}
          <div className={isMobile ? 'space-y-6' : 'space-y-6'}>
            {/* Botones de acción principales */}
            <MainActionButtons
              onAddProduct={openModal}
              onGenerateRecipes={() => setCurrentView('recipes')}
              onScanProduct={onNotificationClick}
              isMobile={isMobile}
              showRecipesCount={products.length}
            />

            {/* Estadísticas - Usar variante sidebar en desktop */}
            <StatsGrid
              stats={stats}
              isMobile={isMobile}
              variant={isMobile ? 'compact' : 'sidebar'}
            />
          </div>
        </div>
      </div>

      {/* Modal para añadir producto */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={addProduct}
        loading={loading}
        isMobile={isMobile}
      />

      {/* Toast de notificaciones */}
      {notification && (
        <NotificationToast
          message={notification}
          type="info"
          onClose={() => showNotification('')}
        />
      )}

      {/* Loading overlay global */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Cargando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error display global */}
      {error && (
        <NotificationToast
          message={error}
          type="error"
          onClose={() => {}} // El error se limpia automáticamente
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
