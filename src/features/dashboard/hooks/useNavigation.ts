// =================================
// Navigation Management Hook
// =================================

import { useState, useCallback, useEffect } from 'react';
import type { DashboardView } from '../types';

interface UseNavigationOptions {
  initialView?: DashboardView;
  enableHistory?: boolean;
  enableKeyboardNavigation?: boolean;
}

interface NavigationState {
  currentView: DashboardView;
  previousView: DashboardView | null;
  history: DashboardView[];
  canGoBack: boolean;
}

export const useNavigation = ({
  initialView = 'dashboard',
  enableHistory = true,
  enableKeyboardNavigation = false
}: UseNavigationOptions = {}) => {
  const [state, setState] = useState<NavigationState>({
    currentView: initialView,
    previousView: null,
    history: [initialView],
    canGoBack: false
  });

  // Navegar a una vista específica
  const navigateTo = useCallback((view: DashboardView) => {
    setState(prev => {
      const newHistory = enableHistory 
        ? [...prev.history, view]
        : [view];

      return {
        currentView: view,
        previousView: prev.currentView,
        history: newHistory,
        canGoBack: newHistory.length > 1
      };
    });
  }, [enableHistory]);

  // Volver a la vista anterior
  const goBack = useCallback(() => {
    setState(prev => {
      if (prev.history.length <= 1) return prev;

      const newHistory = prev.history.slice(0, -1);
      const previousView = newHistory[newHistory.length - 1];

      return {
        currentView: previousView,
        previousView: prev.currentView,
        history: newHistory,
        canGoBack: newHistory.length > 1
      };
    });
  }, []);

  // Ir al dashboard (home)
  const goHome = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  // Limpiar historial
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [prev.currentView],
      canGoBack: false,
      previousView: null
    }));
  }, []);

  // Reemplazar vista actual sin añadir al historial
  const replaceView = useCallback((view: DashboardView) => {
    setState(prev => ({
      ...prev,
      currentView: view,
      history: [...prev.history.slice(0, -1), view]
    }));
  }, []);

  // Navegación con teclado
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Escape para volver atrás
      if (event.key === 'Escape' && state.canGoBack) {
        goBack();
        return;
      }

      // Atajos de teclado
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            navigateTo('dashboard');
            break;
          case '2':
            event.preventDefault();
            navigateTo('fridge');
            break;
          case '3':
            event.preventDefault();
            navigateTo('recipes');
            break;
          case '4':
            event.preventDefault();
            navigateTo('profile');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableKeyboardNavigation, state.canGoBack, navigateTo, goBack]);

  // Utilidades de navegación
  const isCurrentView = useCallback((view: DashboardView): boolean => {
    return state.currentView === view;
  }, [state.currentView]);

  const getViewTitle = useCallback((view: DashboardView): string => {
    const titles: Record<DashboardView, string> = {
      dashboard: 'Dashboard',
      fridge: 'Mi Nevera',
      recipes: 'Recetas IA',
      profile: 'Perfil'
    };
    return titles[view] || view;
  }, []);

  const getViewIcon = useCallback((view: DashboardView): string => {
    const icons: Record<DashboardView, string> = {
      dashboard: '🏠',
      fridge: '❄️',
      recipes: '👨‍🍳',
      profile: '👤'
    };
    return icons[view] || '📄';
  }, []);

  return {
    // Estado
    ...state,
    
    // Acciones principales
    navigateTo,
    goBack,
    goHome,
    clearHistory,
    replaceView,
    
    // Utilidades
    isCurrentView,
    getViewTitle,
    getViewIcon
  };
};

// Hook simplificado para navegación básica
export const useSimpleNavigation = (initialView: DashboardView = 'dashboard') => {
  const [currentView, setCurrentView] = useState<DashboardView>(initialView);
  
  const navigateTo = useCallback((view: DashboardView) => {
    setCurrentView(view);
  }, []);

  const isCurrentView = useCallback((view: DashboardView) => {
    return currentView === view;
  }, [currentView]);

  return {
    currentView,
    navigateTo,
    isCurrentView
  };
};
