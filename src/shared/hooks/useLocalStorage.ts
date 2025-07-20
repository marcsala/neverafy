import { useEffect } from 'react';

interface UseLocalStorageProps {
  session: any;
  products: any[];
  consumedProducts: any[];
  userStats: any;
  notifications: any[];
  isPremium: boolean;
  setProducts: (products: any[]) => void;
  setConsumedProducts: (consumed: any[]) => void;
  setUserStats: (stats: any) => void;
  setNotifications: (notifications: any[]) => void;
  setIsPremium: (premium: boolean) => void;
}

export const useLocalStorage = ({
  session,
  products,
  consumedProducts,
  userStats,
  notifications,
  isPremium,
  setProducts,
  setConsumedProducts,
  setUserStats,
  setNotifications,
  setIsPremium
}: UseLocalStorageProps) => {

  // Cargar datos al iniciar sesión
  useEffect(() => {
    if (!session) return;
    
    const savedProducts = localStorage.getItem('freshAlertProducts');
    const savedConsumed = localStorage.getItem('freshAlertConsumed');
    const savedStats = localStorage.getItem('freshAlertStats');
    const savedNotifications = localStorage.getItem('freshAlertNotifications');
    const savedPremium = localStorage.getItem('freshAlertPremium');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedConsumed) setConsumedProducts(JSON.parse(savedConsumed));
    if (savedStats) setUserStats(JSON.parse(savedStats));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedPremium) setIsPremium(JSON.parse(savedPremium));
  }, [session]);

  // Guardar productos
  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertProducts', JSON.stringify(products));
    }
  }, [products, session]);

  // Guardar productos consumidos
  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertConsumed', JSON.stringify(consumedProducts));
    }
  }, [consumedProducts, session]);

  // Guardar estadísticas de usuario
  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertStats', JSON.stringify(userStats));
    }
  }, [userStats, session]);

  // Guardar notificaciones
  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertNotifications', JSON.stringify(notifications));
    }
  }, [notifications, session]);

  // Guardar estado premium
  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertPremium', JSON.stringify(isPremium));
    }
  }, [isPremium, session]);
};