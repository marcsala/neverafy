// =================================
// Notifications Management Hook
// =================================

import { useState, useCallback, useRef, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: number;
}

interface UseNotificationsOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  autoRemove?: boolean;
}

export const useNotifications = ({
  maxNotifications = 5,
  defaultDuration = 3000,
  autoRemove = true
}: UseNotificationsOptions = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  // Añadir notificación
  const addNotification = useCallback((
    message: string,
    type: Notification['type'] = 'info',
    duration: number = defaultDuration
  ): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setNotifications(prev => {
      // Remover notificaciones antiguas si excedemos el máximo
      const newNotifications = [notification, ...prev];
      if (newNotifications.length > maxNotifications) {
        return newNotifications.slice(0, maxNotifications);
      }
      return newNotifications;
    });

    // Auto-remover si está habilitado y tiene duración
    if (autoRemove && duration > 0) {
      const timeout = setTimeout(() => {
        removeNotification(id);
      }, duration);
      
      timeoutsRef.current.set(id, timeout);
    }

    return id;
  }, [defaultDuration, maxNotifications, autoRemove]);

  // Remover notificación
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Limpiar timeout si existe
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  // Limpiar todas las notificaciones
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    
    // Limpiar todos los timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  // Métodos de conveniencia para diferentes tipos
  const showSuccess = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  // Hook para notificación simple (compatible con el Dashboard actual)
  const [simpleNotification, setSimpleNotification] = useState('');

  const showSimpleNotification = useCallback((message: string) => {
    setSimpleNotification(message);
    setTimeout(() => setSimpleNotification(''), defaultDuration);
  }, [defaultDuration]);

  // Obtener la notificación más reciente
  const latestNotification = notifications[0] || null;

  return {
    // Estado
    notifications,
    latestNotification,
    simpleNotification,
    
    // Acciones principales
    addNotification,
    removeNotification,
    clearAllNotifications,
    
    // Métodos de conveniencia
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showSimpleNotification,
    
    // Compatibilidad con Dashboard actual
    showNotification: showSimpleNotification,
    notification: simpleNotification
  };
};

// Hook simplificado para una sola notificación
export const useSimpleNotification = (duration: number = 3000) => {
  const [notification, setNotification] = useState('');

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), duration);
  }, [duration]);

  const clearNotification = useCallback(() => {
    setNotification('');
  }, []);

  return {
    notification,
    showNotification,
    clearNotification
  };
};
