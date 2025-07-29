// =================================
// Dashboard Types
// =================================

export interface Product {
  id: number;
  name: string;
  quantity: string;
  expiryDate: string;
  daysLeft: number;
  price?: number; // 🆕 Precio del producto (opcional para retrocompatibilidad)
}

export interface DashboardProps {
  userStats?: any;
  stats?: any;
  notifications?: any[];
  products?: Product[];
  productActions?: any;
  userName?: string;
  userId?: string;
}

export interface ProductFormData {
  name: string;
  expiryDate: string;
  quantity: string;
  category?: string;
  price?: number; // 🆕 Precio en el formulario
}

export interface ExpiryBadge {
  class: 'urgent' | 'warning' | 'safe';
  text: string;
}

export interface DashboardStats {
  totalProducts: number;
  expiringSoon: number;
  savedMoney: string;
  co2Saved: string;
  totalValue?: number; // 🆕 Valor total del inventario
  potentialWaste?: number; // 🆕 Valor potencial de desperdicio
}

export interface UrgentProduct extends Product {
  isToday: boolean;
}

export type DashboardView = 'dashboard' | 'fridge' | 'profile' | 'recipes';

export interface DashboardState {
  products: Product[];
  currentView: DashboardView;
  isModalOpen: boolean;
  notification: string;
  isMobile: boolean;
  loading: boolean;
  error: string | null;
}

export interface DashboardActions {
  setCurrentView: (view: DashboardView) => void;
  openModal: () => void;
  closeModal: () => void;
  showNotification: (message: string) => void;
  addProduct: (data: ProductFormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateProduct: (id: number, data: Partial<ProductFormData>) => Promise<void>;
}

// Supabase product interface (para conversión)
export interface SupabaseProduct {
  id: string;
  name: string;
  category: string;
  expiry_date: string;
  quantity: string | number;
  price?: number; // 🆕 Precio en Supabase
  source: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
