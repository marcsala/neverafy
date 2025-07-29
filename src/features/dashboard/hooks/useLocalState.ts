// =================================
// Local State Management Hook
// =================================

import { useState, useCallback, useReducer } from 'react';

interface LocalState {
  isModalOpen: boolean;
  isLoading: boolean;
  selectedProduct: string | null;
  filters: {
    category: string;
    urgentOnly: boolean;
    searchTerm: string;
  };
  ui: {
    sidebarCollapsed: boolean;
    gridView: boolean;
    showHelp: boolean;
  };
}

type LocalStateAction = 
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SELECT_PRODUCT'; payload: string | null }
  | { type: 'SET_FILTER'; payload: { key: keyof LocalState['filters']; value: any } }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_UI'; payload: { key: keyof LocalState['ui']; value: any } }
  | { type: 'RESET_STATE' };

const initialState: LocalState = {
  isModalOpen: false,
  isLoading: false,
  selectedProduct: null,
  filters: {
    category: 'all',
    urgentOnly: false,
    searchTerm: ''
  },
  ui: {
    sidebarCollapsed: false,
    gridView: true,
    showHelp: false
  }
};

const localStateReducer = (state: LocalState, action: LocalStateAction): LocalState => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true };
    
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters
      };
    
    case 'SET_UI':
      return {
        ...state,
        ui: {
          ...state.ui,
          [action.payload.key]: action.payload.value
        }
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
};

export const useLocalState = () => {
  const [state, dispatch] = useReducer(localStateReducer, initialState);

  // Actions para modal
  const openModal = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL' });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  // Actions para loading
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  // Actions para selección de producto
  const selectProduct = useCallback((productId: string | null) => {
    dispatch({ type: 'SELECT_PRODUCT', payload: productId });
  }, []);

  // Actions para filtros
  const setFilter = useCallback((key: keyof LocalState['filters'], value: any) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilter('category', category);
  }, [setFilter]);

  const setUrgentOnly = useCallback((urgentOnly: boolean) => {
    setFilter('urgentOnly', urgentOnly);
  }, [setFilter]);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilter('searchTerm', searchTerm);
  }, [setFilter]);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // Actions para UI
  const setUI = useCallback((key: keyof LocalState['ui'], value: any) => {
    dispatch({ type: 'SET_UI', payload: { key, value } });
  }, []);

  const toggleSidebar = useCallback(() => {
    setUI('sidebarCollapsed', !state.ui.sidebarCollapsed);
  }, [state.ui.sidebarCollapsed, setUI]);

  const toggleGridView = useCallback(() => {
    setUI('gridView', !state.ui.gridView);
  }, [state.ui.gridView, setUI]);

  const toggleHelp = useCallback(() => {
    setUI('showHelp', !state.ui.showHelp);
  }, [state.ui.showHelp, setUI]);

  // Action para reset completo
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  return {
    // Estado
    ...state,
    
    // Actions para modal
    openModal,
    closeModal,
    
    // Actions para loading
    setLoading,
    
    // Actions para productos
    selectProduct,
    
    // Actions para filtros
    setFilter,
    setCategory,
    setUrgentOnly,
    setSearchTerm,
    resetFilters,
    
    // Actions para UI
    setUI,
    toggleSidebar,
    toggleGridView,
    toggleHelp,
    
    // Reset
    resetState
  };
};

// Hook simplificado para estado básico
export const useSimpleLocalState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    isModalOpen,
    isLoading,
    selectedProduct,
    setIsModalOpen,
    setIsLoading,
    setSelectedProduct,
    openModal,
    closeModal
  };
};

// Hook para persistir estado en localStorage
export const usePersistentLocalState = (key: string = 'dashboard-state') => {
  const [state, dispatch] = useReducer(localStateReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? { ...initial, ...JSON.parse(saved) } : initial;
    } catch {
      return initial;
    }
  });

  // Guardar en localStorage cuando cambie el estado
  const saveState = useCallback(() => {
    try {
      localStorage.setItem(key, JSON.stringify({
        filters: state.filters,
        ui: state.ui
        // No guardamos isModalOpen, isLoading, selectedProduct
      }));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }, [key, state]);

  // Todas las acciones del hook normal
  const localState = useLocalState();

  return {
    ...localState,
    saveState
  };
};
