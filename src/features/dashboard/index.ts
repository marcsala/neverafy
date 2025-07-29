// =================================
// Dashboard Feature Main Export
// =================================

// 🎯 Main Components
export { default as Dashboard } from './components/DashboardRefactored';

// 🎨 UI Components
export {
  DashboardLayout,
  UrgentAlerts,
  ProductsList,
  AddProductModal,
  NotificationToast,
  MainActionButtons,
  StatsGrid,
  DashboardView,
  ProgressSection,
  PremiumBanner,
  NotificationList,
  QuickActions
} from './components';

// 🧠 Hooks
export {
  useDashboard,
  useSimpleDashboard,
  useProductManagement,
  useResponsive,
  useIsMobile,
  useOrientation,
  useNotifications,
  useSimpleNotification,
  useNavigation,
  useSimpleNavigation,
  useDashboardAnalytics,
  useBasicStats,
  useLocalState,
  useSimpleLocalState,
  usePersistentLocalState
} from './hooks';

// 📊 Types
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
} from './types';

// 🔧 Utils
export {
  convertSupabaseProduct,
  getExpiryBadge,
  getUrgentProducts,
  getExpiringSoonCount,
  calculateDashboardStats,
  validateProductForm,
  getTodayDate,
  calculateDaysLeft,
  formatPrice,
  calculateTotalValue,
  calculateUrgentValue,
  estimatePrice
} from './utils';

// 📝 Constants
export { MOCK_PRODUCTS } from './utils/mockData';

// 🎯 Default export - Main Dashboard Component
export { default } from './components/DashboardRefactored';
