import React, { useState } from 'react';

interface ProfileProps {
  onBack: () => void;
  isMobile: boolean;
  userName?: string;
  userEmail?: string;
}

const ProfileView: React.FC<ProfileProps> = ({ onBack, isMobile, userName = 'Usuario', userEmail = 'usuario@email.com' }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: userName,
    email: userEmail,
    phone: '+34 600 000 000',
    location: 'Madrid, España',
    birthDate: '1990-01-01',
    plan: 'Premium',
    expiryAlerts: 2,
    shoppingReminders: true,
    emailNotifications: true
  });

  const sections = [
    {
      id: 'personal',
      title: 'Información Personal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      items: [
        { label: 'Nombre completo', value: userData.name, type: 'text', key: 'name' },
        { label: 'Email', value: userData.email, type: 'email', key: 'email' },
        { label: 'Teléfono', value: userData.phone, type: 'tel', key: 'phone' },
        { label: 'Ubicación', value: userData.location, type: 'text', key: 'location' },
        { label: 'Fecha de nacimiento', value: userData.birthDate, type: 'date', key: 'birthDate' }
      ]
    },
    {
      id: 'security',
      title: 'Seguridad',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      actions: [
        { label: 'Cambiar contraseña', action: 'change-password' },
        { label: 'Autenticación en dos pasos (2FA)', action: 'setup-2fa', status: 'Desactivado' },
        { label: 'Configuración de privacidad', action: 'privacy-settings' },
        { label: 'Eliminar cuenta', action: 'delete-account', danger: true }
      ]
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h1a3 3 0 003-3V7a3 3 0 113 0v9a3 3 0 003 3h1" />
        </svg>
      ),
      settings: [
        { 
          label: 'Alertas de caducidad', 
          type: 'select', 
          value: userData.expiryAlerts, 
          options: [
            { value: 1, label: '1 día antes' },
            { value: 2, label: '2 días antes' },
            { value: 3, label: '3 días antes' }
          ],
          key: 'expiryAlerts'
        },
        { 
          label: 'Recordatorios de compra', 
          type: 'toggle', 
          value: userData.shoppingReminders, 
          key: 'shoppingReminders' 
        },
        { 
          label: 'Notificaciones por email', 
          type: 'toggle', 
          value: userData.emailNotifications, 
          key: 'emailNotifications' 
        }
      ]
    },
    {
      id: 'subscription',
      title: 'Suscripción y Facturación',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      subscription: {
        plan: userData.plan,
        nextBilling: '2025-08-28',
        amount: '4,99€'
      }
    }
  ];

  const handleInputChange = (key: string, value: any) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'change-password':
        alert('Funcionalidad de cambio de contraseña - Por implementar');
        break;
      case 'setup-2fa':
        alert('Configuración de 2FA - Por implementar');
        break;
      case 'privacy-settings':
        alert('Configuración de privacidad - Por implementar');
        break;
      case 'delete-account':
        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
          alert('Eliminación de cuenta - Por implementar');
        }
        break;
      case 'change-plan':
        alert('Cambio de plan - Por implementar');
        break;
      case 'payment-methods':
        alert('Métodos de pago - Por implementar');
        break;
      case 'billing-history':
        alert('Historial de facturación - Por implementar');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Mi Perfil</h1>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
            <p className="text-gray-500">{userData.email}</p>
            <div className="flex items-center mt-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                userData.plan === 'Premium' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {userData.plan}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-4 space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">
                  {section.icon}
                </div>
                <span className="font-semibold text-gray-900">{section.title}</span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  activeSection === section.id ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeSection === section.id && (
              <div className="border-t border-gray-100 p-4 space-y-4">
                {/* Personal Information */}
                {section.items && (
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {item.label}
                        </label>
                        <input
                          type={item.type}
                          value={item.value}
                          onChange={(e) => handleInputChange(item.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    ))}
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4">
                      Guardar cambios
                    </button>
                  </div>
                )}

                {/* Security Actions */}
                {section.actions && (
                  <div className="space-y-3">
                    {section.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleAction(action.action)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          action.danger
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{action.label}</span>
                        {action.status && (
                          <span className="text-sm text-gray-500">{action.status}</span>
                        )}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

                {/* Notification Settings */}
                {section.settings && (
                  <div className="space-y-4">
                    {section.settings.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <span className="text-gray-700">{setting.label}</span>
                        {setting.type === 'toggle' ? (
                          <button
                            onClick={() => handleInputChange(setting.key, !setting.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              setting.value ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                setting.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <select
                            value={setting.value}
                            onChange={(e) => handleInputChange(setting.key, parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          >
                            {setting.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Subscription Info */}
                {section.subscription && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Plan actual</span>
                        <span className="font-semibold text-gray-900">{section.subscription.plan}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Próxima facturación</span>
                        <span className="text-sm text-gray-900">{section.subscription.nextBilling}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Importe</span>
                        <span className="font-semibold text-gray-900">{section.subscription.amount}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => handleAction('change-plan')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Cambiar plan
                      </button>
                      <button
                        onClick={() => handleAction('payment-methods')}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Métodos de pago
                      </button>
                      <button
                        onClick={() => handleAction('billing-history')}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Historial
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-sm text-gray-500">
        <p>Neverafy v1.0.0</p>
        <p className="mt-1">
          <a href="/roadmap" className="text-blue-600 hover:text-blue-700">Ver roadmap de funcionalidades</a>
        </p>
      </div>
    </div>
  );
};

export default ProfileView;