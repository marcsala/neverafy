// ==============================================
// 🎖️ COMPONENTE PREMIUM STATUS
// ==============================================
// Muestra el estado actual de la suscripción del usuario

import React, { useState } from 'react';
import { Crown, Settings, Calendar, CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import { useSubscription } from '../../shared/hooks/useSubscription';
import PremiumUpgradeModal from './PremiumUpgradeModal';

const PremiumStatus: React.FC = () => {
  const { subscription, isPremium, isLoading, cancelSubscription } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción Premium?')) {
      return;
    }

    setIsCancelling(true);
    const success = await cancelSubscription();
    
    if (success) {
      alert('Suscripción cancelada correctamente. Seguirás teniendo acceso Premium hasta el final del período actual.');
    } else {
      alert('Error al cancelar la suscripción. Por favor, inténtalo de nuevo.');
    }
    setIsCancelling(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="text-gray-600 ml-2">Cargando estado de suscripción...</span>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upgrade a Premium
                </h3>
                <p className="text-gray-600 mb-4">
                  Desbloquea recetas con IA, alertas inteligentes y mucho más
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Recetas personalizadas con IA</li>
                  <li>• Análisis nutricional avanzado</li>
                  <li>• Alertas inteligentes</li>
                  <li>• Soporte prioritario</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgradearte ahora
            </button>
          </div>
        </div>

        <PremiumUpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </>
    );
  }

  // Usuario Premium
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isActive = subscription?.status === 'active';
  const isCancelled = subscription?.status === 'cancelled';

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-gray-900">
                Neverafy Premium
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isActive 
                  ? 'bg-green-100 text-green-700' 
                  : isCancelled 
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {isActive ? 'Activo' : isCancelled ? 'Cancelado' : subscription?.status}
              </span>
            </div>
            <p className="text-gray-600">
              {subscription?.plan || 'Plan Premium'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.open('https://app.lemonsqueezy.com/billing', '_blank')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            title="Gestionar suscripción"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Información de la suscripción */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
          <Calendar className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm text-gray-600">
              {isCancelled ? 'Activo hasta' : 'Próxima renovación'}
            </p>
            <p className="font-semibold text-gray-900">
              {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm text-gray-600">Estado del pago</p>
            <p className="font-semibold text-gray-900">
              {isActive ? 'Al día' : 'Verificar pago'}
            </p>
          </div>
        </div>
      </div>

      {/* Funciones Premium activas */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Funciones activas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <PremiumFeatureBadge title="Recetas con IA" />
          <PremiumFeatureBadge title="Alertas Smart" />
          <PremiumFeatureBadge title="Análisis Nutricional" />
          <PremiumFeatureBadge title="Soporte VIP" />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => window.open('https://app.lemonsqueezy.com/billing', '_blank')}
          className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-gray-700 font-medium rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Gestionar suscripción
        </button>

        {isActive && !isCancelled && (
          <button
            onClick={handleCancelSubscription}
            disabled={isCancelling}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            {isCancelling ? 'Cancelando...' : 'Cancelar suscripción'}
          </button>
        )}
      </div>

      {isCancelled && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Suscripción cancelada:</strong> Seguirás teniendo acceso a las funciones Premium hasta el {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'final del período actual'}.
          </p>
        </div>
      )}
    </div>
  );
};

// ==============================================
// 🎨 COMPONENTE AUXILIAR
// ==============================================

interface PremiumFeatureBadgeProps {
  title: string;
}

const PremiumFeatureBadge: React.FC<PremiumFeatureBadgeProps> = ({ title }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-white/70 rounded-lg">
    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </div>
);

export default PremiumStatus;
