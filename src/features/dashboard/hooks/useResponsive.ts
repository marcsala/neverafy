// =================================
// Responsive Detection Hook
// =================================

import { useState, useEffect, useCallback } from 'react';

interface UseResponsiveOptions {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  desktopBreakpoint?: number;
}

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export const useResponsive = ({
  mobileBreakpoint = 768,
  tabletBreakpoint = 1024,
  desktopBreakpoint = 1280
}: UseResponsiveOptions = {}) => {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Inicialización segura para SSR
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1920,
        height: 1080
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint,
      width,
      height
    };
  });

  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setState({
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint,
      width,
      height
    });
  }, [mobileBreakpoint, tabletBreakpoint, desktopBreakpoint]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Llamar una vez al montar para asegurar valores correctos
    updateDimensions();

    // Agregar listener
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  // Utilidades adicionales
  const getDeviceType = useCallback((): 'mobile' | 'tablet' | 'desktop' => {
    if (state.isMobile) return 'mobile';
    if (state.isTablet) return 'tablet';
    return 'desktop';
  }, [state]);

  const isLandscape = state.width > state.height;
  const isPortrait = state.height > state.width;
  const aspectRatio = state.width / state.height;

  return {
    // Estados principales
    ...state,
    
    // Utilidades
    deviceType: getDeviceType(),
    isLandscape,
    isPortrait,
    aspectRatio,
    
    // Funciones
    updateDimensions
  };
};

// Hook simplificado para solo detección móvil
export const useIsMobile = (breakpoint: number = 768) => {
  const { isMobile } = useResponsive({ mobileBreakpoint: breakpoint });
  return isMobile;
};

// Hook para orientación
export const useOrientation = () => {
  const { width, height } = useResponsive();
  
  return {
    isLandscape: width > height,
    isPortrait: height > width,
    aspectRatio: width / height
  };
};
