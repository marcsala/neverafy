import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Features components
import { DashboardView } from '@/features/dashboard/components';
import { CameraView } from '@/features/camera/components';
import { ProductsView } from '@/features/products/components';
import { RecipesView } from '@/features/recipes/components';
import { AchievementsView } from '@/features/achievements';
import { AnalyticsView } from '@/features/analytics';

// Constants
import { ACHIEVEMENTS } from '@/shared/utils/constants';

interface AppRoutesProps {
  // Data
  stats: any;
  userStats: any;
  notifications: any[];
  products: any[];
  isPremium: boolean;
  
  // Handlers
  setCurrentView: (view: string) => void;
  setIsPremium: (premium: boolean) => void;
  
  // Product actions
  addProduct: (product: any) => void;
  markAsConsumed: (product: any, wasConsumed?: boolean) => void;
  removeProduct: (id: string | number) => void;
  addDetectedProduct: (product: any) => string;
  
  // OCR logic
  ocrLogic: {
    processImage: (file: File) => Promise<any>;
  };
  
  // Recipe logic
  recipeLogic: {
    generateAIRecipesHandler: (products: any[]) => Promise<any[]>;
    isGeneratingRecipes: boolean;
    generatedRecipes: any[];
    markRecipeAsCooked: (recipe: any) => void;
  };
  
  // Premium handler
  handleUpgradeToPremium: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  stats,
  userStats,
  notifications,
  products,
  isPremium,
  setCurrentView,
  setIsPremium,
  addProduct,
  markAsConsumed,
  removeProduct,
  addDetectedProduct,
  ocrLogic,
  recipeLogic,
  handleUpgradeToPremium
}) => {
  return (
    <Routes>
      {/* Redirigir a dashboard por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={<DashboardView 
        stats={stats} 
        userStats={userStats} 
        notifications={notifications} 
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        onNavigate={setCurrentView}
      />} />
      
      <Route path="/products" element={<ProductsView
        products={Array.isArray(products) ? products : []}
        onAddProduct={addProduct}
        onMarkAsConsumed={markAsConsumed}
        onRemoveProduct={removeProduct}
        onNavigateToCamera={() => setCurrentView('camera')}
        isPremium={isPremium}
        userStats={userStats}
      />} />
      
      <Route path="/camera" element={<CameraView
        isPremium={isPremium}
        userStats={userStats}
        onProcessImage={ocrLogic.processImage}
        onAddProduct={addDetectedProduct}
        onUpgradeToPremium={handleUpgradeToPremium}
      />} />
      
      <Route path="/recipes" element={<RecipesView
        products={Array.isArray(products) ? products : []}
        isPremium={isPremium}
        userStats={userStats}
        onGenerateAIRecipes={recipeLogic.generateAIRecipesHandler}
        onUpgradeToPremium={handleUpgradeToPremium}
        isGenerating={recipeLogic.isGeneratingRecipes}
        generatedRecipes={recipeLogic.generatedRecipes}
        onRecipeCooked={recipeLogic.markRecipeAsCooked}
      />} />
      
      <Route path="/achievements" element={<AchievementsView 
        achievements={ACHIEVEMENTS} 
        products={products} 
        userStats={userStats} 
      />} />
      
      <Route path="/analytics" element={<AnalyticsView 
        stats={stats} 
        userStats={userStats} 
        isPremium={isPremium} 
        setIsPremium={setIsPremium} 
      />} />
    </Routes>
  );
};

export default AppRoutes;