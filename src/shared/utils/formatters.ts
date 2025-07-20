// shared/utils/formatters.ts

/**
 * Formatea números de precio en euros
 */
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)}€`;
};

/**
 * Formatea números con decimales limitados
 */
export const formatNumber = (number: number, decimals: number = 1): string => {
  return number.toFixed(decimals);
};

/**
 * Formatea peso en kg con unidad
 */
export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)}kg`;
};

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea categorías para mostrar
 */
export const formatCategory = (category: string): string => {
  return capitalize(category);
};

/**
 * Formatea porcentajes
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Formatea puntos con separadores de miles
 */
export const formatPoints = (points: number): string => {
  return new Intl.NumberFormat('es-ES').format(points);
};

/**
 * Formatea nombres de productos para búsqueda
 */
export const normalizeProductName = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .trim();
};

/**
 * Formatea texto de confianza OCR
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

/**
 * Trunca texto con elipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formatea duración en minutos/horas
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formatea números grandes (1K, 1M, etc.)
 */
export const formatLargeNumber = (number: number): string => {
  if (number < 1000) return number.toString();
  if (number < 1000000) return `${(number / 1000).toFixed(1)}K`;
  return `${(number / 1000000).toFixed(1)}M`;
};

/**
 * Formatea texto de nivel de usuario
 */
export const formatLevel = (level: number): string => {
  return `Nivel ${level}`;
};

/**
 * Formatea tiempo relativo (hace X días, etc.)
 */
export const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Hace unos segundos';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  
  return targetDate.toLocaleDateString('es-ES');
};

/**
 * Formatea mensajes de error de forma amigable
 */
export const formatErrorMessage = (error: string): string => {
  // Traduce errores comunes de Supabase/auth
  const errorMap: { [key: string]: string } = {
    'Invalid login credentials': 'Credenciales incorrectas',
    'Email not confirmed': 'Email no confirmado',
    'User already registered': 'Usuario ya registrado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Network error': 'Error de conexión'
  };

  return errorMap[error] || error;
};

/**
 * Formatea el estado de suscripción
 */
export const formatSubscriptionStatus = (tier: string, expiresAt?: string): string => {
  if (tier === 'premium') {
    if (expiresAt) {
      const daysLeft = Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) return `Premium (vence en ${daysLeft} días)`;
      return 'Premium Activo';
    }
    return 'Premium Activo';
  }
  return 'Free';
};
