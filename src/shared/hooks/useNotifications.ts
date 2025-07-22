import { useCallback } from 'react';
import { getDaysToExpiry } from '@/shared/utils/dateUtils';

interface UseNotificationsProps {
  products: any[];
  setNotifications: (updater: (prev: any[]) => any[]) => void;
}

export const useNotifications = ({ products, setNotifications }: UseNotificationsProps) => {
  
  const generateNotifications = useCallback(() => {
    const newNotifications: any[] = [];
    const productsArray = Array.isArray(products) ? products : [];
    
    productsArray.forEach(product => {
      const daysToExpiry = getDaysToExpiry(product.expiryDate);
      if (daysToExpiry <= 1 && daysToExpiry >= 0) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: 'warning',
          message: `¡${product.name} vence ${daysToExpiry === 0 ? 'hoy' : 'mañana'}!`,
          timestamp: new Date().toISOString()
        });
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications].slice(-5));
    }
  }, [products, setNotifications]);

  const addNotification = useCallback((notification: { type: string; message: string }) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      ...notification,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [...prev, newNotification].slice(-5));
  }, [setNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    generateNotifications,
    addNotification,
    clearNotifications
  };
};