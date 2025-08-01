/**
 * Calcula los días hasta la fecha de vencimiento
 */
export const getDaysToExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Obtiene la clase CSS para alertas basada en días hasta vencimiento
 */
export const getAlertColor = (daysToExpiry: number): string => {
  if (daysToExpiry < 0) return 'text-red-600 bg-red-50 border-red-200';
  if (daysToExpiry <= 1) return 'text-orange-600 bg-orange-50 border-orange-200';
  if (daysToExpiry <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-green-600 bg-green-50 border-green-200';
};

/**
 * Formatea una fecha para mostrar
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Verifica si un producto está vencido
 */
export const isExpired = (expiryDate: string): boolean => {
  return getDaysToExpiry(expiryDate) < 0;
};

/**
 * Verifica si un producto expira pronto (en 3 días o menos)
 */
export const isExpiringSoon = (expiryDate: string): boolean => {
  const days = getDaysToExpiry(expiryDate);
  return days >= 0 && days <= 3;
};

/**
 * Obtiene el texto de estado de vencimiento
 */
export const getExpiryStatusText = (expiryDate: string): string => {
  const days = getDaysToExpiry(expiryDate);
  
  if (days < 0) {
    const daysPast = Math.abs(days);
    return daysPast === 1 ? 'Venció ayer' : `Venció hace ${daysPast} días`;
  }
  
  if (days === 0) return 'Vence hoy';
  if (days === 1) return 'Vence mañana';
  if (days <= 3) return `Vence en ${days} días`;
  if (days <= 7) return `Vence en ${days} días`;
  
  return `Vence en ${days} días`;
};

/**
 * Formatea fecha de vencimiento para mostrar
 */
export const formatExpiryDate = (expiryDate: string): string => {
  const date = new Date(expiryDate);
  const today = new Date();
  const days = getDaysToExpiry(expiryDate);
  
  // Formatear fecha completa
  const formatted = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
  
  return formatted;
};