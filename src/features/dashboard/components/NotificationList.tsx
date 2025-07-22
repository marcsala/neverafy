// features/dashboard/components/NotificationList.tsx

import React from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, Crown } from 'lucide-react';
import { formatRelativeTime } from '@/shared/utils/formatters';
import { NOTIFICATION_TYPES } from '@/shared/utils/constants';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onRemove?: (id: string) => void;
  maxVisible?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead,
  onRemove,
  maxVisible = 3 
}) => {
  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.EXPIRY_WARNING:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case NOTIFICATION_TYPES.PREMIUM:
        return <Crown className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    const baseOpacity = isRead ? 'bg-opacity-30' : 'bg-opacity-50';
    
    switch (type) {
      case NOTIFICATION_TYPES.EXPIRY_WARNING:
        return `bg-orange-50 ${baseOpacity}`;
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return `bg-green-50 ${baseOpacity}`;
      case NOTIFICATION_TYPES.PREMIUM:
        return `bg-purple-50 ${baseOpacity}`;
      default:
        return `bg-blue-50 ${baseOpacity}`;
    }
  };

  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🔔 Alertas Recientes
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </h3>
        
        {notifications.length > maxVisible && (
          <span className="text-sm text-gray-500">
            Mostrando {maxVisible} de {notifications.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {visibleNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${
              getNotificationBg(notification.type, notification.isRead)
            } ${notification.isRead ? 'opacity-75' : ''}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(notification.timestamp)}
                  </p>
                </div>
                
                <div className="flex gap-1 flex-shrink-0">
                  {!notification.isRead && onMarkAsRead && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="text-gray-400 hover:text-green-600 transition-colors p-1"
                      title="Marcar como leída"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  
                  {onRemove && (
                    <button
                      onClick={() => onRemove(notification.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Eliminar notificación"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > maxVisible && (
        <div className="mt-4 text-center">
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            Ver todas las notificaciones ({notifications.length - maxVisible} más)
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
