// ==============================================
// 🍋 SIMPLE LEMONSQUEEZY INTEGRATION
// ==============================================

import React, { useState } from 'react';
import { Crown, Sparkles, X } from 'lucide-react';

interface SimplePremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const SimplePremiumModal: React.FC<SimplePremiumModalProps> = ({
  isOpen,
  onClose,
  userEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // URLs directas de checkout de LemonSqueezy
  const monthlyCheckoutUrl = `https://neverafy.lemonsqueezy.com/checkout/buy/${import.meta.env.VITE_LEMONSQUEEZY_PREMIUM_MONTHLY_ID}?checkout[email]=${encodeURIComponent(userEmail)}`;
  const yearlyCheckoutUrl = `https://neverafy.lemonsqueezy.com/checkout/buy/${import.meta.env.VITE_LEMONSQUEEZY_PREMIUM_YEARLY_ID}?checkout[email]=${encodeURIComponent(userEmail)}`;

  const handleUpgrade = (planType: 'monthly' | 'yearly') => {
    setIsLoading(true);
    const checkoutUrl = planType === 'monthly' ? monthlyCheckoutUrl : yearlyCheckoutUrl;
    window.location.href = checkoutUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade a Premium
          </h2>
          <p className="text-gray-600">
            Desbloquea recetas con IA y funciones avanzadas
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-gray-700">Recetas personalizadas con IA</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Crown className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700">Alertas inteligentes avanzadas</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Plan Mensual */}
          <button
            onClick={() => handleUpgrade('monthly')}
            disabled={isLoading}
            className="w-full p-4 border-2 border-gray-200 hover:border-amber-400 rounded-xl transition-all text-left"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">Premium Mensual</h3>
                <p className="text-sm text-gray-600">Facturación mensual</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">€9.99</div>
                <div className="text-sm text-gray-600">/mes</div>
              </div>
            </div>
          </button>

          {/* Plan Anual */}
          <button
            onClick={() => handleUpgrade('yearly')}
            disabled={isLoading}
            className="w-full p-4 border-2 border-amber-400 bg-amber-50 rounded-xl transition-all text-left relative"
          >
            <div className="absolute -top-2 left-4">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Ahorra 17%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">Premium Anual</h3>
                <p className="text-sm text-gray-600">2 meses gratis</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">€99.99</div>
                <div className="text-sm text-gray-600 line-through">€119.88</div>
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Procesado de forma segura por LemonSqueezy
        </p>
      </div>
    </div>
  );
};

export default SimplePremiumModal;
