// ==============================================
// 🍋 SÚPER SIMPLE - SOLO BOTÓN DE LEMONSQUEEZY
// ==============================================

import React from 'react';
import { Crown } from 'lucide-react';

const SimpleUpgradeButton: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Upgrade a Premium</h3>
            <p className="text-gray-600">Recetas con IA y funciones avanzadas</p>
          </div>
        </div>
        
        {/* 🍋 AQUÍ PEGAS EL CÓDIGO QUE TE DA LEMONSQUEEZY */}
        <div>
          {/* Ejemplo de lo que te dará LemonSqueezy: */}
          <a href="https://neverafy.lemonsqueezy.com/buy/0d8fe582-01f6-4766-9075-44bbf46780e4?embed=1" class="lemonsqueezy-button">Buy Neverafy Premium</a><script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
        </div>
      </div>
    </div>
  );
};

export default SimpleUpgradeButton;
