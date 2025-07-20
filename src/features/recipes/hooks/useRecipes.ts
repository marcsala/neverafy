// features/recipes/hooks/useRecipes.ts

import { useState, useCallback, useMemo } from 'react';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';
import { ENHANCED_RECIPE_DATABASE } from '../../../shared/utils/constants';

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  prepTime: string;
  cookTime?: string;
  servings?: number;
  ingredients: string[];
  steps: string[];
  tips?: string;
  nutrition?: string;
  category?: string;
  isAI?: boolean;
  usedProducts?: string[];
  createdAt?: string;
  cookedAt?: string;
  rating?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
}

/**
 * Hook para manejar recetas generadas y guardadas
 */
export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [cookedRecipes, setCookedRecipes] = useState<Set<string>>(new Set());

  const addRecipe = useCallback((recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString()
    };
    
    setRecipes(prev => [newRecipe, ...prev]);
    return newRecipe;
  }, []);

  const addMultipleRecipes = useCallback((newRecipes: Omit<Recipe, 'id' | 'createdAt'>[]) => {
    const recipesWithIds = newRecipes.map(recipe => ({
      ...recipe,
      id: `recipe-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString()
    }));
    
    setRecipes(prev => [...recipesWithIds, ...prev]);
    return recipesWithIds;
  }, []);

  const removeRecipe = useCallback((recipeId: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    setSavedRecipes(prev => {
      const newSaved = new Set(prev);
      newSaved.delete(recipeId);
      return newSaved;
    });
    setCookedRecipes(prev => {
      const newCooked = new Set(prev);
      newCooked.delete(recipeId);
      return newCooked;
    });
  }, []);

  const saveRecipe = useCallback((recipeId: string) => {
    setSavedRecipes(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(recipeId)) {
        newSaved.delete(recipeId);
      } else {
        newSaved.add(recipeId);
      }
      return newSaved;
    });
  }, []);

  const markAsCooked = useCallback((recipeId: string) => {
    setCookedRecipes(prev => new Set([...prev, recipeId]));
    
    // Actualizar la receta con fecha de cocción
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, cookedAt: new Date().toISOString() }
        : recipe
    ));
  }, []);

  const rateRecipe = useCallback((recipeId: string, rating: number) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, rating }
        : recipe
    ));
  }, []);

  const clearAllRecipes = useCallback(() => {
    setRecipes([]);
    setSavedRecipes(new Set());
    setCookedRecipes(new Set());
  }, []);

  return {
    recipes,
    savedRecipes,
    cookedRecipes,
    addRecipe,
    addMultipleRecipes,
    removeRecipe,
    saveRecipe,
    markAsCooked,
    rateRecipe,
    clearAllRecipes,
    isRecipeSaved: (recipeId: string) => savedRecipes.has(recipeId),
    isRecipeCooked: (recipeId: string) => cookedRecipes.has(recipeId)
  };
};

/**
 * Hook para generar sugerencias rápidas de recetas
 */
export const useQuickRecipes = (products: Product[]) => {
  return useMemo(() => {
    const urgentProducts = products.filter(p => getDaysToExpiry(p.expiryDate) <= 3);
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
                isUrgent,
                usedProductIds: [product.id]
              });
            }
          });
        }
      });
    });

    return suggestions
      .sort((a, b) => {
        if (a.urgency !== b.urgency) {
          return a.urgency - b.urgency;
        }
        return a.difficulty === 'Fácil' ? -1 : 1;
      })
      .slice(0, 8);
  }, [products]);
};

/**
 * Hook para estadísticas de recetas
 */
export const useRecipeStats = (recipes: Recipe[], cookedRecipes: Set<string>) => {
  return useMemo(() => {
    const stats = {
      total: recipes.length,
      ai: recipes.filter(r => r.isAI).length,
      quick: recipes.filter(r => !r.isAI).length,
      cooked: cookedRecipes.size,
      avgRating: 0,
      byDifficulty: {
        'Fácil': recipes.filter(r => r.difficulty === 'Fácil').length,
        'Medio': recipes.filter(r => r.difficulty === 'Medio').length,
        'Difícil': recipes.filter(r => r.difficulty === 'Difícil').length
      },
      categories: {} as Record<string, number>
    };

    // Calcular rating promedio
    const ratedRecipes = recipes.filter(r => r.rating && r.rating > 0);
    if (ratedRecipes.length > 0) {
      stats.avgRating = ratedRecipes.reduce((sum, r) => sum + (r.rating || 0), 0) / ratedRecipes.length;
    }

    // Contar por categorías
    recipes.forEach(recipe => {
      if (recipe.category) {
        stats.categories[recipe.category] = (stats.categories[recipe.category] || 0) + 1;
      }
    });

    return stats;
  }, [recipes, cookedRecipes]);
};

/**
 * Hook para filtrar y buscar recetas
 */
export const useRecipeFilters = (recipes: Recipe[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Fácil' | 'Medio' | 'Difícil'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ai' | 'quick'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'difficulty'>('newest');

  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      // Filtro de búsqueda
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de dificultad
      const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;

      // Filtro de categoría
      const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;

      // Filtro de tipo
      const matchesType = typeFilter === 'all' || 
                         (typeFilter === 'ai' && recipe.isAI) || 
                         (typeFilter === 'quick' && !recipe.isAI);

      return matchesSearch && matchesDifficulty && matchesCategory && matchesType;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'difficulty':
          const difficultyOrder = { 'Fácil': 1, 'Medio': 2, 'Difícil': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }, [recipes, searchTerm, difficultyFilter, categoryFilter, typeFilter, sortBy]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDifficultyFilter('all');
    setCategoryFilter('all');
    setTypeFilter('all');
    setSortBy('newest');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    difficultyFilter,
    setDifficultyFilter,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    filteredRecipes,
    clearFilters,
    hasActiveFilters: searchTerm !== '' || difficultyFilter !== 'all' || 
                     categoryFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'newest'
  };
};

/**
 * Hook principal que combina toda la funcionalidad de recetas
 */
export const useRecipeManager = () => {
  const recipeHook = useRecipes();
  const filterHook = useRecipeFilters(recipeHook.recipes);
  const stats = useRecipeStats(recipeHook.recipes, recipeHook.cookedRecipes);

  const getRecipeById = useCallback((id: string) => {
    return recipeHook.recipes.find(recipe => recipe.id === id);
  }, [recipeHook.recipes]);

  const getRecipesByCategory = useCallback((category: string) => {
    return recipeHook.recipes.filter(recipe => recipe.category === category);
  }, [recipeHook.recipes]);

  const getSavedRecipes = useCallback(() => {
    return recipeHook.recipes.filter(recipe => 
      recipe.id && recipeHook.savedRecipes.has(recipe.id)
    );
  }, [recipeHook.recipes, recipeHook.savedRecipes]);

  const getCookedRecipes = useCallback(() => {
    return recipeHook.recipes.filter(recipe => 
      recipe.id && recipeHook.cookedRecipes.has(recipe.id)
    );
  }, [recipeHook.recipes, recipeHook.cookedRecipes]);

  return {
    ...recipeHook,
    ...filterHook,
    stats,
    getRecipeById,
    getRecipesByCategory,
    getSavedRecipes,
    getCookedRecipes
  };
};
