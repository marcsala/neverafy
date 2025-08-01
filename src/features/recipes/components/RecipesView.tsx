// features/recipes/components/RecipesView.tsx

import React, { useState } from 'react';
import { Sparkles, BookOpen, Grid, List, Filter } from 'lucide-react';
import RecipeGenerator from './RecipeGenerator';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import { Button } from '@/shared/components/ui';

interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
}

interface Recipe {
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
}

interface RecipesViewProps {
  products: Product[];
  isPremium: boolean;
  userStats: {
    recipesGenerated: number;
  };
  onGenerateAIRecipes: (products: Product[]) => Promise<Recipe[]>;
  onUpgradeToPremium?: () => void;
  isGenerating: boolean;
  generatedRecipes: Recipe[];
  onRecipeCooked?: (recipe: Recipe) => void;
}

const RecipesView: React.FC<RecipesViewProps> = ({
  products,
  isPremium,
  userStats,
  onGenerateAIRecipes,
  onUpgradeToPremium,
  isGenerating,
  generatedRecipes,
  onRecipeCooked
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set());
  const [filterBy, setFilterBy] = useState<'all' | 'ai' | 'quick' | 'saved'>('all');

  const handleSaveRecipe = (recipe: Recipe) => {
    const recipeId = recipe.id || recipe.name;
    const newSaved = new Set(savedRecipes);
    
    if (newSaved.has(recipeId)) {
      newSaved.delete(recipeId);
    } else {
      newSaved.add(recipeId);
    }
    
    setSavedRecipes(newSaved);
  };

  const handleRecipeCooked = (recipe: Recipe) => {
    if (onRecipeCooked) {
      onRecipeCooked(recipe);
    }
    // Cerrar modal si está abierto
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(null);
    }
  };

  const getAllRecipes = (): Recipe[] => {
    const allRecipes: Recipe[] = [];
    
    // Agregar recetas generadas por IA
    allRecipes.push(...generatedRecipes);
    
    return allRecipes;
  };

  const getFilteredRecipes = (): Recipe[] => {
    const allRecipes = getAllRecipes();
    
    switch (filterBy) {
      case 'ai':
        return allRecipes.filter(recipe => recipe.isAI);
      case 'quick':
        return allRecipes.filter(recipe => !recipe.isAI);
      case 'saved':
        return allRecipes.filter(recipe => 
          savedRecipes.has(recipe.id || recipe.name)
        );
      default:
        return allRecipes;
    }
  };

  const filteredRecipes = getFilteredRecipes();

  return (
    <div className="space-y-6">
      {/* Generador de recetas IA */}
      <RecipeGenerator
        products={products}
        isPremium={isPremium}
        userStats={userStats}
        onGenerateRecipes={onGenerateAIRecipes}
        onUpgradeToPremium={onUpgradeToPremium}
        isGenerating={isGenerating}
      />

      {/* Recetas generadas y guardadas */}
      {filteredRecipes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Tus Recetas ({filteredRecipes.length})
                </h3>
                <p className="text-gray-600">
                  Recetas generadas y guardadas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Filtros */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'Todas', count: getAllRecipes().length },
                  { key: 'ai', label: 'IA', count: getAllRecipes().filter(r => r.isAI).length },
                  { key: 'saved', label: 'Guardadas', count: savedRecipes.size }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterBy(filter.key as any)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filterBy === filter.key
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {filterBy === 'saved' ? 'No hay recetas guardadas' : 
                 filterBy === 'ai' ? 'No hay recetas IA generadas' :
                 'No hay recetas disponibles'}
              </h4>
              <p className="text-gray-500">
                {filterBy === 'saved' 
                  ? 'Guarda recetas que te gusten para encontrarlas fácilmente.'
                  : 'Genera algunas recetas IA para verlas aquí.'
                }
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id || index}
                  recipe={recipe}
                  onView={setSelectedRecipe}
                  onSave={handleSaveRecipe}
                  onCook={handleRecipeCooked}
                  compact={viewMode === 'list'}
                  isSaved={savedRecipes.has(recipe.id || recipe.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sugerencias rápidas */}
      {/* TODO: Implementar QuickRecipes component */}

      {/* Modal de receta */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onSave={handleSaveRecipe}
        onCook={handleRecipeCooked}
        isSaved={selectedRecipe ? savedRecipes.has(selectedRecipe.id || selectedRecipe.name) : false}
      />

      {/* Información adicional para usuarios gratuitos */}
      {!isPremium && generatedRecipes.length === 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                🍳 Descubre el poder de las recetas IA
              </h3>
              <p className="text-purple-700 mb-4">
                Genera recetas personalizadas que aprovechan exactamente los productos que tienes 
                y que vencen pronto. ¡Claude AI crea recetas únicas para ti!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-purple-600 mb-4">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>Personalizadas para tus productos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Reduce desperdicio alimentario</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🧠</span>
                  <span>Powered by Claude AI</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 mb-4">
                <h4 className="font-medium text-gray-800 mb-2">🎁 Planes disponibles:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• <strong>Gratuito:</strong> 2 generaciones de recetas IA por mes</div>
                  <div>• <strong>Premium:</strong> Recetas IA ilimitadas + funciones exclusivas</div>
                </div>
              </div>

              {/* 🍋 BOTÓN DIRECTO LEMONSQUEEZY */}
              <a 
                href="https://neverafy.lemonsqueezy.com/buy/0d8fe582-01f6-4766-9075-44bbf46780e4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Ver Premium
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesView;
