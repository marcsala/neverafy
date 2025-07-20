import { create } from 'zustand';

interface UserStats {
  totalSaved: number;
  co2Saved: number;
  points: number;
  streak: number;
  level: number;
  ocrUsed: number;
  recipesGenerated: number;
}

interface NewProduct {
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
  price: string;
}

interface StoreState {
  currentView: string;
  products: any[];
  consumedProducts: any[];
  userStats: UserStats;
  newProduct: NewProduct;
  showAddForm: boolean;
  searchTerm: string;
  selectedCategory: string;
  notifications: any[];
  isPremium: boolean;
  selectedImage: File | null;
  imagePreview: string | null;
  isProcessingOCR: boolean;
  ocrResults: any;
  generatedRecipes: any[];
  isGeneratingRecipes: boolean;
  selectedRecipe: any;

  // Actions
  setCurrentView: (view: string) => void;
  setProducts: (products: any[]) => void;
  setConsumedProducts: (consumedProducts: any[]) => void;
  setUserStats: (stats: UserStats | ((prev: UserStats) => UserStats)) => void;
  setNewProduct: (product: NewProduct) => void;
  setShowAddForm: (show: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setNotifications: (notifications: any[] | ((prev: any[]) => any[])) => void;
  setIsPremium: (premium: boolean) => void;
  setSelectedImage: (image: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  setIsProcessingOCR: (processing: boolean) => void;
  setOcrResults: (results: any) => void;
  setGeneratedRecipes: (recipes: any[]) => void;
  setIsGeneratingRecipes: (generating: boolean) => void;
  setSelectedRecipe: (recipe: any) => void;
}

const useStore = create<StoreState>((set) => ({
  currentView: 'dashboard',
  products: [],
  consumedProducts: [],
  userStats: {
    totalSaved: 0,
    co2Saved: 0,
    points: 0,
    streak: 0,
    level: 1,
    ocrUsed: 0,
    recipesGenerated: 0
  },
  newProduct: {
    name: '',
    category: 'frutas',
    expiryDate: '',
    quantity: 1,
    price: ''
  },
  showAddForm: false,
  searchTerm: '',
  selectedCategory: 'all',
  notifications: [],
  isPremium: false,
  selectedImage: null,
  imagePreview: null,
  isProcessingOCR: false,
  ocrResults: null,
  generatedRecipes: [],
  isGeneratingRecipes: false,
  selectedRecipe: null,

  setCurrentView: (view) => set({ currentView: view }),
  setProducts: (products) => set({ products: Array.isArray(products) ? products : [] }),
  setConsumedProducts: (consumedProducts) => set({ consumedProducts: consumedProducts }),
  setUserStats: (stats) => set((state) => ({ 
    userStats: typeof stats === 'function' ? stats(state.userStats) : stats 
  })),
  setNewProduct: (product) => set({ newProduct: product }),
  setShowAddForm: (show) => set({ showAddForm: show }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setNotifications: (notifications) => set((state) => ({ 
    notifications: typeof notifications === 'function' ? notifications(state.notifications) : notifications 
  })),
  setIsPremium: (premium) => set({ isPremium: premium }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setImagePreview: (preview) => set({ imagePreview: preview }),
  setIsProcessingOCR: (processing) => set({ isProcessingOCR: processing }),
  setOcrResults: (results) => set({ ocrResults: results }),
  setGeneratedRecipes: (recipes) => set({ generatedRecipes: recipes }),
  setIsGeneratingRecipes: (generating) => set({ isGeneratingRecipes: generating }),
  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),
}));

export default useStore;
