// Categorías de productos
export const CATEGORIES = [
  'frutas', 'verduras', 'lácteos', 'carne', 'pescado',
  'pan', 'conservas', 'congelados', 'huevos', 'otros'
];

// Alias para compatibilidad
export const PRODUCT_CATEGORIES = CATEGORIES;

// Base de datos de recetas mejorada
export const ENHANCED_RECIPE_DATABASE = {
  'plátano': {
    recipes: ['Smoothie tropical energético', 'Pan de plátano casero', 'Pancakes de plátano'],
    urgency: ['Batido express (5 min)', 'Plátano con canela al horno'],
    difficulty: 'Fácil'
  },
  'manzana': {
    recipes: ['Tarta de manzana clásica', 'Compota casera', 'Ensalada waldorf'],
    urgency: ['Manzana asada con miel', 'Smoothie verde detox'],
    difficulty: 'Medio'
  },
  'tomate': {
    recipes: ['Gazpacho andaluz', 'Salsa marinara', 'Ensalada caprese'],
    urgency: ['Tostadas con tomate', 'Zumo de tomate natural'],
    difficulty: 'Fácil'
  },
  'lechuga': {
    recipes: ['Caesar salad', 'Wraps healthy', 'Smoothie verde'],
    urgency: ['Ensalada rápida', 'Sandwich vegetal'],
    difficulty: 'Fácil'
  },
  'pollo': {
    recipes: ['Pollo al curry', 'Ensalada césar', 'Sopa de pollo'],
    urgency: ['Pollo a la plancha', 'Sandwich de pollo'],
    difficulty: 'Medio'
  },
  'leche': {
    recipes: ['Natillas caseras', 'Bechamel', 'Flan de huevo'],
    urgency: ['Batidos variados', 'Café con leche especial'],
    difficulty: 'Fácil'
  },
  'pan': {
    recipes: ['Torrijas tradicionales', 'Pan rallado casero', 'Tostadas francesas'],
    urgency: ['Tostadas gourmet', 'Picatostes para sopa'],
    difficulty: 'Fácil'
  },
  'huevos': {
    recipes: ['Tortilla española', 'Huevos benedictinos', 'Merengue casero'],
    urgency: ['Huevos revueltos', 'Tortilla francesa'],
    difficulty: 'Medio'
  }
} as const;

// Logros del sistema
export const ACHIEVEMENTS = [
  { id: 1, name: 'Primer Paso', description: 'Añade tu primer producto', icon: '🌱', unlocked: false, points: 10 },
  { id: 2, name: 'Eco Guerrero', description: 'Ahorra 10€ en comida', icon: '💚', unlocked: false, points: 50 },
  { id: 3, name: 'Chef Sostenible', description: 'Cocina 5 recetas sugeridas', icon: '👨‍🍳', unlocked: false, points: 30 },
  { id: 4, name: 'Racha de Fuego', description: '7 días sin desperdiciar', icon: '🔥', unlocked: false, points: 100 },
  { id: 5, name: 'Maestro Verde', description: 'Reduce 50kg de CO2', icon: '🌍', unlocked: false, points: 200 },
  { id: 6, name: 'Ojo de Halcón', description: 'Usa OCR 10 veces', icon: '📸', unlocked: false, points: 75 },
  { id: 7, name: 'Chef IA', description: 'Genera 20 recetas con IA', icon: '🤖', unlocked: false, points: 150 }
];

// Límites freemium
export const FREEMIUM_LIMITS = {
  OCR_MONTHLY: 3,
  RECIPES_MONTHLY: 5
};

// Puntos por acciones
export const POINTS = {
  ADD_PRODUCT: 10,
  USE_OCR: 15,
  GENERATE_RECIPE: 20,
  CONSUME_PRODUCT_ON_TIME: 25,
  CONSUME_PRODUCT_EXPIRED: 10,
  COOK_RECIPE: 30
};

// Umbrales de nivel
export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 5000,
  9: 7500,
  10: 10000
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  EXPIRY_WARNING: 'expiry_warning',
  ACHIEVEMENT: 'achievement',
  PREMIUM: 'premium',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

// Valores por defecto
export const DEFAULT_PRODUCT_PRICE = 3;
export const CO2_SAVED_PER_PRODUCT = 0.5;
export const CO2_SAVED_PER_RECIPE = 0.3;