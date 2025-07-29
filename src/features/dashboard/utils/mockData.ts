// =================================
// Dashboard Mock Data
// =================================

import type { Product } from '../types';

/**
 * Productos de ejemplo para el dashboard (con precios)
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Leche entera",
    quantity: "1 litro",
    expiryDate: "2025-07-30",
    daysLeft: 3,
    price: 1.25 // 🆕 Precio añadido
  },
  {
    id: 2,
    name: "Tomates cherry",
    quantity: "500g",
    expiryDate: "2025-08-01",
    daysLeft: 5,
    price: 2.80 // 🆕 Precio añadido
  },
  {
    id: 3,
    name: "Yogur natural",
    quantity: "4 unidades",
    expiryDate: "2025-07-28",
    daysLeft: 1,
    price: 3.20 // 🆕 Precio añadido
  },
  {
    id: 4,
    name: "Pollo fileteado",
    quantity: "600g",
    expiryDate: "2025-07-29",
    daysLeft: 2,
    price: 6.50 // 🆕 Precio añadido
  },
  {
    id: 5,
    name: "Pan integral",
    quantity: "1 barra",
    expiryDate: "2025-08-01",
    daysLeft: 5,
    price: 1.85 // 🆕 Precio añadido
  }
];

/**
 * 🆕 Productos para testing con diferentes rangos de precio
 */
export const MOCK_PRODUCTS_WITH_VARIETY: Product[] = [
  ...MOCK_PRODUCTS,
  {
    id: 6,
    name: "Salmón fresco",
    quantity: "300g",
    expiryDate: "2025-07-30",
    daysLeft: 3,
    price: 15.90
  },
  {
    id: 7,
    name: "Aguacates",
    quantity: "3 unidades",
    expiryDate: "2025-08-03",
    daysLeft: 7,
    price: 4.50
  },
  {
    id: 8,
    name: "Queso manchego",
    quantity: "200g",
    expiryDate: "2025-08-15",
    daysLeft: 19,
    price: 8.75
  }
];
