// =================================
// Dashboard Layout Component
// =================================

import React from 'react';

interface DashboardLayoutProps {
  isMobile: boolean;
  userName: string;
  currentView: string;
  onNavigate: (view: string) => void;
  onNotificationClick: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  isMobile,
  userName,
  currentView,
  onNavigate,
  onNotificationClick,
  children
}) => {
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="bg-white p-4 border-b border-gray-200 sticky top-0 z-50">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-900">Neverafy</div>
            <div className="flex items-center gap-4">
              <button
                onClick={onNotificationClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="m13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
              <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="min-h-screen pb-20">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span className="text-xs font-medium">Inicio</span>
          </button>
          
          <button
            onClick={() => onNavigate('fridge')}
            className={`flex flex-col items-center gap-1 p-2 ${
              currentView === 'fridge' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2.5 2v6h19V2"/>
              <path d="M2.5 8v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V8"/>
            </svg>
            <span className="text-xs font-medium">Nevera</span>
          </button>
          
          <button
            onClick={() => onNotificationClick()}
            className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center mx-4 shadow-lg"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          
          <button
            onClick={() => onNavigate('recipes')}
            className={`flex flex-col items-center gap-1 p-2 ${
              currentView === 'recipes' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="text-xs font-medium">Recetas ✨</span>
          </button>
          
          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 p-2 ${
              currentView === 'profile' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </nav>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-6 z-50" style={{ width: '280px' }}>
        <div className="mb-8">
          <div className="text-2xl font-semibold text-gray-900 mb-2">Neverafy</div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">Nevera inteligente</div>
            </div>
          </div>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('fridge')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 2v6h19V2"/>
                  <path d="M2.5 8v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V8"/>
                </svg>
                Mi Nevera
              </button>
            </li>
            <li>
              <button
                onClick={onNotificationClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Escanear Producto
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('recipes')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Recetas IA ✨
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Perfil
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Desktop Main Content */}
      <main style={{ marginLeft: '280px' }} className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
