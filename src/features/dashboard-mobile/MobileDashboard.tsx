import React, { useState } from 'react';
import { UrgentAlerts, MainActions, QuickStats, QuickFridge } from './';

interface MobileDashboardProps {
  userStats: any;
  products: any[];
  notifications: any[];
  setCurrentView: (view: string) => void;
  productActions: {
    markAsConsumed: (productId: string | number) => void;
  };
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  userStats,
  products,
  notifications,
  setCurrentView,
  productActions
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const urgentProducts = products.filter(p => {
    const daysToExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 1;
  });

  const handleAddProduct = () => {
    setCurrentView('add-product');
  };

  const handleOpenCamera = () => {
    setCurrentView('camera');
  };

  const handleViewUrgent = () => {
    setCurrentView('urgent-products');
  };

  const handleViewAll = () => {
    setCurrentView('all-products');
  };

  const handleMarkConsumed = (productId: string | number) => {
    productActions.markAsConsumed(productId);
  };

  const handleViewProduct = (productId: string | number) => {
    setCurrentView(`product-${productId}`);
  };

  return (
    <div className="relative">
      {refreshing && (
        <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-700 text-center py-2 text-sm z-40">
          Actualizando...
        </div>
      )}
      
      <UrgentAlerts 
        products={products} 
        onViewUrgent={handleViewUrgent}
      />
      
      <MainActions 
        onAddProduct={handleAddProduct}
        onOpenCamera={handleOpenCamera}
      />
      
      <QuickStats 
        userStats={userStats} 
        totalProducts={products.length}
      />
      
      <QuickFridge 
        products={products}
        onViewAll={handleViewAll}
        onMarkConsumed={handleMarkConsumed}
        onViewProduct={handleViewProduct}
      />
      
      {/* Pull to refresh area */}
      <div 
        className="text-center py-8 text-gray-400 text-sm cursor-pointer"
        onClick={onRefresh}
      >
        👆 Desliza hacia abajo para actualizar
      </div>
    </div>
  );
};