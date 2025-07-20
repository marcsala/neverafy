import { useState, useCallback } from 'react';
import { generateAIRecipes } from '../../../services/claudeApi';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';
import { ENHANCED_RECIPE_DATABASE, FREEMIUM_LIMITS, POINTS, CO2_SAVED_PER_RECIPE } from '../../../shared/utils/constants';

interface UseRecipeGenerationProps {
  products: any[];
  isPremium: boolean;
  userStats: { recipesGenerated: number };
  setUserStats: (updater: (prev: any) => any) => void;
}

export const useRecipeGeneration = ({ 
  products, 
  isPremium, 
  userStats, 
  setUserStats 
}: UseRecipeGenerationProps) => {
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const generateAIRecipesHandler = useCallback(async (urgentProducts: any[]) => {
    // Verificar límites freemium
    if (!isPremium && userStats.recipesGenerated >= FREEMIUM_LIMITS.RECIPES_MONTHLY) {
      throw new Error('🔒 Has alcanzado el límite de 5 recetas mensuales. ¡Actualiza a Premium para recetas ilimitadas!');
    }

    setIsGeneratingRecipes(true);

    try {
      const recipes = await generateAIRecipes(urgentProducts);
      setGeneratedRecipes(recipes);
      
      setUserStats(prev => ({
        ...prev,
        recipesGenerated: prev.recipesGenerated + 1,
        points: prev.points + POINTS.GENERATE_RECIPE
      }));

      return recipes;
    } catch (error) {
      console.error('Error generating recipes:', error);
      throw error;
    } finally {
      setIsGeneratingRecipes(false);
    }
  }, [isPremium, userStats.recipesGenerated, setUserStats]);

  const getSuggestedRecipes = useCallback(() => {
    const urgentProducts = Array.isArray(products) 
      ? products.filter(p => getDaysToExpiry(p.expiryDate) <= 3) 
      : [];
    const suggestions: any[] = [];

    urgentProducts.forEach(product => {
      const productName = product.name.toLowerCase();
      Object.keys(ENHANCED_RECIPE_DATABASE).forEach(ingredient => {
        if (productName.includes(ingredient)) {
          const recipeData = ENHANCED_RECIPE_DATABASE[ingredient as keyof typeof ENHANCED_RECIPE_DATABASE];
          const isUrgent = getDaysToExpiry(product.expiryDate) <= 1;
          const recipesToUse = isUrgent ? recipeData.urgency : recipeData.recipes;

          recipesToUse.forEach(recipe => {
            if (!suggestions.find(s => s.recipe === recipe)) {
              suggestions.push({
                recipe,
                ingredients: [product.name],
                urgency: getDaysToExpiry(product.expiryDate),
                difficulty: recipeData.difficulty,
                isUrgent
              });
            }
          });
        }
      });
    });

    return suggestions.slice(0, 6);
  }, [products]);

  const markRecipeAsCooked = useCallback((recipe: any) => {
    setUserStats(prev => ({
      ...prev,
      points: prev.points + POINTS.COOK_RECIPE,
      co2Saved: prev.co2Saved + CO2_SAVED_PER_RECIPE
    }));
  }, [setUserStats]);

  return {
    generatedRecipes,
    isGeneratingRecipes,
    selectedRecipe,
    generateAIRecipesHandler,
    getSuggestedRecipes,
    markRecipeAsCooked,
    setGeneratedRecipes,
    setSelectedRecipe
  };
};