import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TouchableCard } from '@/shared/components/mobile';

interface UrgentAlertsProps {
  products: any[];
  onViewUrgent: () => void;
}

export const UrgentAlerts: React.FC<UrgentAlertsProps> = ({
  products,
  onViewUrgent
}) => {
  const todayProducts = products.filter(p => {
    const daysToExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 0;
  });
  
  const tomorrowProducts = products.filter(p => {
    const daysToExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysToExpiry === 1;
  });
  
  if (todayProducts.length === 0 && tomorrowProducts.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-3 bg-red-50 border-b">
      {todayProducts.length > 0 && (
        <TouchableCard 
          className="bg-red-100 border-red-300 p-4 rounded-xl border"
          onPress={onViewUrgent}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-red-800">⚠️ Vencen HOY</h3>
              <p className="text-red-600">{todayProducts.length} productos</p>
            </div>
            <ChevronRight className="text-red-600" size={20} />
          </div>
        </TouchableCard>
      )}
      
      {tomorrowProducts.length > 0 && (
        <TouchableCard 
          className={`bg-amber-100 border-amber-300 p-4 rounded-xl border ${todayProducts.length > 0 ? 'mt-2' : ''}`}
          onPress={onViewUrgent}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-amber-800">⏰ Vencen MAÑANA</h3>
              <p className="text-amber-600">{tomorrowProducts.length} productos</p>
            </div>
            <ChevronRight className="text-amber-600" size={20} />
          </div>
        </TouchableCard>
      )}
    </section>
  );
};