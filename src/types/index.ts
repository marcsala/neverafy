// =================================
// Global Type Exports
// =================================

// Dashboard types
export type {
  Product,
  DashboardProps,
  DashboardState,
  DashboardActions,
  DashboardView,
  ProductFormData,
  DashboardStats,
  ExpiryBadge,
  UrgentProduct,
  SupabaseProduct
} from '../features/dashboard/types';

// Shared types
export type {
  // Add other shared types as needed
} from '../shared/types' | undefined;

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
