// ==============================================
// 🌟 COMPONENTE PREMIUM UPGRADE MODAL
// ==============================================
// Modal para mostrar planes premium y procesar checkout

import React, { useState } from 'react';
import { X, Sparkles, Zap, Crown, Check, Loader2 } from 'lucide-react';
import { useCheckout } from '../../shared/hooks/useSubscription';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFeature?: string; // Feature que desencadenó el modal
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentFeature = 'Recetas con IA'
}) => {
  const { startCheckout, isProcessing, error } = useCheckout();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async () => {
    await startCheckout(selectedPlan);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Upgrade a Neverafy Premium
            </h2>
            <p className="text-gray-600 text-lg">
              Desbloquea todo el potencial de tu nevera inteligente
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-8 pb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-purple-500" />}
              title="Recetas con IA"
              description="Genera recetas personalizadas basadas en los ingredientes de tu nevera"
              isHighlighted={currentFeature === 'Recetas con IA'}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-blue-500" />}
              title="Alertas Inteligentes"
              description="Notificaciones avanzadas y recomendaciones de uso optimizado"
            />
            <FeatureCard
              icon={<Check className="w-6 h-6 text-green-500" />}
              title="Análisis Nutricional"
              description="Información detallada sobre el valor nutricional de tus alimentos"
            />
            <FeatureCard
              icon={<Crown className="w-6 h-6 text-amber-500" />}
              title="Soporte Prioritario"
              description="Acceso directo al equipo de soporte y nuevas funciones"
            />
          </div>

          {/* Pricing Plans */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center text-gray-900 mb-6">
              Elige tu plan
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Plan Mensual */}
              <PricingCard
                title="Premium Mensual"
                price="€9.99"
                period="mes"
                features={[
                  'Recetas ilimitadas con IA',
                  'Alertas inteligentes',
                  'Análisis nutricional',
                  'Soporte prioritario'
                ]}
                isSelected={selectedPlan === 'monthly'}
                onSelect={() => setSelectedPlan('monthly')}
                badge={null}
              />

              {/* Plan Anual */}
              <PricingCard
                title="Premium Anual"
                price="€99.99"
                period="año"
                originalPrice="€119.88"
                features={[
                  'Recetas ilimitadas con IA',
                  'Alertas inteligentes',
                  'Análisis nutricional',
                  'Soporte prioritario',
                  '2 meses GRATIS'
                ]}
                isSelected={selectedPlan === 'yearly'}
                onSelect={() => setSelectedPlan('yearly')}
                badge="Ahorra 17%"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Upgradearte ahora - {selectedPlan === 'monthly' ? '€9.99/mes' : '€99.99/año'}
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 mt-3">
              Cancela en cualquier momento • Facturación segura con LemonSqueezy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================================
// 🎨 COMPONENTES AUXILIARES
// ==============================================

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isHighlighted }) => (
  <div className={`p-4 rounded-xl border-2 transition-all ${
    isHighlighted 
      ? 'border-amber-200 bg-amber-50' 
      : 'border-gray-100 bg-gray-50'
  }`}>
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  originalPrice?: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
  badge?: string | null;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  period, 
  originalPrice,
  features, 
  isSelected, 
  onSelect, 
  badge 
}) => (
  <div 
    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
      isSelected 
        ? 'border-amber-400 bg-amber-50 shadow-lg' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
    onClick={onSelect}
  >
    {badge && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {badge}
        </span>
      </div>
    )}
    
    <div className="text-center">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <div className="mb-4">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600">/{period}</span>
        </div>
        {originalPrice && (
          <div className="text-sm text-gray-500 line-through mt-1">
            {originalPrice}/{period}
          </div>
        )}
      </div>
    </div>
    
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
    
    {isSelected && (
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      </div>
    )}
  </div>
);

export default PremiumUpgradeModal;
