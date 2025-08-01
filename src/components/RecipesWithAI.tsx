// ==============================================
// 🍋 EJEMPLO DE USO SIMPLE
// ==============================================

import React from 'react';
import { Crown } from 'lucide-react';
import { useSimplePremium, usePremiumGate } from '../shared/hooks/useSimplePremium';
import { useSupabaseAuth } from '../shared/hooks/useSupabase';
import SimplePremiumModal from '../components/premium/SimplePremiumModal';

const RecipesWithAI: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { isPremium } = useSimplePremium();
  const { showUpgradeModal, setShowUpgradeModal, requirePremium } = usePremiumGate();

  const handleGenerateRecipe = () => {
    // Verificar si el usuario es premium antes de generar receta
    if (requirePremium('Generación de recetas con IA')) {
      return; // Se mostrará el modal automáticamente
    }
    
    // Si es premium, continuar con la generación
    console.log('Generando receta con IA...');
    // Tu lógica aquí
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Recetas con IA</h2>
        
        {isPremium ? (
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <Crown className="w-5 h-5" />
            <span>Premium activo - Recetas ilimitadas</span>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800">
              Esta función requiere Neverafy Premium
            </p>
          </div>
        )}

        <button
          onClick={handleGenerateRecipe}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Generar Receta con IA
        </button>
      </div>

      {/* Modal de upgrade */}
      <SimplePremiumModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userEmail={user?.email || ''}
      />
    </div>
  );
};

export default RecipesWithAI;
