// features/dashboard/components/DashboardView.tsx

import React from 'react';
import StatsGrid from './StatsGrid';
import ProgressSection from './ProgressSection';
import PremiumBanner from './PremiumBanner';
import NotificationList from './NotificationList';
import QuickActions from './QuickActions';

interface DashboardViewProps {
  stats: {
    total: number;
    expiringSoon: number;
    expired: number;
    totalConsumed: number;
    totalWasted: number;
  };
  userStats: {
    level: number;
    points: number;
    streak: number;
    totalSaved: number;
    co2Saved: number;
    ocrUsed: number;
    recipesGenerated: number;
  };
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
  }>;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  onNavigate: (view: string) => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onRemoveNotification?: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  userStats,
  notifications,
  isPremium,
  setIsPremium,
  onNavigate,
  onMarkNotificationAsRead,
  onRemoveNotification
}) => {
  return (
    <div className="space-y-6">
      {/* Premium Banner */}
      <PremiumBanner
        isPremium={isPremium}
        onUpgradeToPremium={() => setIsPremium(true)}
        userStats={userStats}
      />

      {/* Stats principales */}
      <StatsGrid 
        stats={stats} 
        userStats={userStats} 
      />

      {/* Progreso y nivel */}
      <ProgressSection 
        userStats={userStats} 
        isPremium={isPremium}
      />

      {/* Acciones rápidas */}
      <QuickActions
        onNavigate={onNavigate}
        stats={stats}
        userStats={userStats}
        isPremium={isPremium}
      />

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={onMarkNotificationAsRead}
          onRemove={onRemoveNotification}
          maxVisible={3}
        />
      )}
    </div>
  );
};

export default DashboardView;
