import React from 'react';

const LandingPageComplete: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🥬</span>
            <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Neverafy
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/login" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Iniciar Sesión
            </a>
            <a 
              href="/register" 
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Empezar Gratis
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-black mb-6 leading-tight">
              Tu nevera,{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                inteligente
              </span>
            </h1>
            <p className="text-2xl text-gray-600 font-light mb-8">
              Nunca más desperdicies comida
            </p>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
              Organiza tu nevera, ahorra dinero y cuida el planeta. Neverafy usa IA para gestionar tu comida y eliminar el desperdicio.
            </p>

            {/* Pain Points */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 mb-10 border border-white/30">
              <h3 className="font-semibold mb-5 text-gray-800">¿Te suena familiar?</h3>
              <div className="space-y-4">
                {[
                  'Se te olvida qué tienes en la nevera',
                  'Compras cosas que ya tenías',
                  'Descubres comida caducada',
                  '250€ de comida a la basura cada año'
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ✗
                    </div>
                    <span className="text-gray-600">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-5 flex-wrap">
              <a 
                href="/register" 
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
              >
                <span className="text-2xl">🚀</span>
                Empezar Gratis
              </a>
              <a 
                href="/login" 
                className="bg-white/90 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all hover:scale-105 border-2 border-white/30 flex items-center gap-3"
              >
                <span className="text-2xl">👤</span>
                Iniciar Sesión
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-8 mt-8 border-t border-white/30">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">★★★★★</span>
                <span className="text-sm text-gray-600">4.9/5</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-green-600">+1,247</span>
                <span className="text-gray-600"> familias ahorrando</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative w-80 h-160 animate-pulse">
              <div className="absolute inset-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl">
                <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-[2.5rem] p-6 overflow-hidden relative">
                  {/* Phone Status Bar */}
                  <div className="flex justify-between items-center mb-6 text-sm font-semibold">
                    <span>9:41</span>
                    <span>100% 🔋</span>
                  </div>

                  {/* App Content */}
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🥬</div>
                    <h3 className="text-2xl font-black text-gray-800">Neverafy</h3>
                    <p className="text-xs text-gray-500">Tu nevera inteligente</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/90 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-black text-green-600">127€</div>
                      <div className="text-xs text-gray-500">Ahorrados</div>
                    </div>
                    <div className="bg-white/90 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-black text-blue-600">23</div>
                      <div className="text-xs text-gray-500">Productos</div>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="space-y-3">
                    <div className="bg-white/90 rounded-xl p-4 border-l-4 border-green-500">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">🥛 Leche</span>
                        <span className="text-xs text-gray-500">3 días</span>
                      </div>
                    </div>
                    <div className="bg-amber-50/90 rounded-xl p-4 border-l-4 border-amber-500">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">🍅 Tomates</span>
                        <span className="text-xs text-amber-600">Mañana</span>
                      </div>
                    </div>
                    <div className="bg-red-50/90 rounded-xl p-4 border-l-4 border-red-500">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">🧀 Queso</span>
                        <span className="text-xs text-red-600">¡Hoy!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 text-sm font-semibold mb-6 border border-white/30">
              <span className="text-xl">✨</span>
              Funciones principales
            </div>
            <h2 className="text-5xl font-black mb-6">Todo lo que necesitas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gestión inteligente de tu nevera con tecnología de vanguardia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: '📸',
                title: 'Escaneo con IA',
                description: 'Saca fotos a tus productos y la IA los identifica automáticamente',
                highlight: 'Reconocimiento 97% preciso'
              },
              {
                icon: '⏰',
                title: 'Alertas Inteligentes',
                description: 'Te avisamos antes de que caduquen tus productos',
                highlight: 'Notificaciones personalizadas'
              },
              {
                icon: '🍳',
                title: 'Recetas con IA',
                description: 'Genera recetas increíbles con lo que tienes en casa',
                highlight: 'Recetas ilimitadas'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-3xl p-10 border border-white/30 hover:shadow-xl transition-all hover:scale-105 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <p className="text-sm text-green-600 font-semibold">{feature.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-8">¿Listo para empezar?</h2>
          <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
            Únete a más de 1,000 familias que ya están ahorrando dinero y cuidando el planeta
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a 
              href="/register" 
              className="bg-white text-green-600 px-10 py-5 rounded-2xl font-black text-xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
            >
              <span className="text-2xl">🚀</span>
              Empezar Gratis Ahora
            </a>
            <a 
              href="/login"
              className="border-2 border-white text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white hover:text-green-600 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">👤</span>
              Iniciar Sesión
            </a>
          </div>
          <div className="flex justify-center gap-10 mt-12 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Gratis para siempre</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Configuración en 2 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🥬</span>
                <span className="text-2xl font-black">Neverafy</span>
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-xl text-xs font-semibold">BETA</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                La primera app inteligente para gestionar tu nevera y eliminar el desperdicio de comida.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Producto</h3>
              <div className="space-y-3">
                <a href="/login" className="block text-gray-400 hover:text-white transition-colors">Iniciar Sesión</a>
                <a href="/register" className="block text-gray-400 hover:text-white transition-colors">Registrarse</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Recursos</h3>
              <div className="space-y-3">
                <a href="/roadmap" className="block text-gray-400 hover:text-white transition-colors">Roadmap</a>
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacidad</a>
                <a href="/terms" className="block text-gray-400 hover:text-white transition-colors">Términos</a>
                <a href="mailto:hola@neverafy.com" className="block text-gray-400 hover:text-white transition-colors">Contacto</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center flex-wrap gap-4">
            <p className="text-gray-400 text-sm">© 2025 Neverafy. Todos los derechos reservados.</p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Disponible en España
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageComplete;
