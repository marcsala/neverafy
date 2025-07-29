// Exportar todos los componentes nuevos limpios
export { default as CleanLandingPage } from './CleanLandingPage';
export { CleanLoginPage, CleanRegisterPage } from './CleanAuthPages';
export { default as DashboardComponent } from './Dashboard';

// Re-export para compatibilidad
export { CleanLandingPage as LandingPage };
export { CleanLoginPage as LoginPage };
export { CleanRegisterPage as RegisterPage };
export { DashboardComponent as Dashboard };