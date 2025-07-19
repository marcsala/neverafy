import create from 'zustand';

const useStore = create((set) => ({
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
  setProducts: (products) => set({ products: products }),
  setConsumedProducts: (consumedProducts) => set({ consumedProducts: consumedProducts }),
  setUserStats: (stats) => set({ userStats: stats }),
  setNewProduct: (product) => set({ newProduct: product }),
  setShowAddForm: (show) => set({ showAddForm: show }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setNotifications: (notifications) => set({ notifications: notifications }),
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
