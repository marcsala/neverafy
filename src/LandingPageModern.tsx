import React from 'react';

const LandingPageModern: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Neverafy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Funciones</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Precios</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium">Testimonios</a>
              <a href="/roadmap" className="text-gray-600 hover:text-gray-900 font-medium">Roadmap</a>
              <a href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Iniciar Sesión</a>
              <a href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
                Prueba Gratis
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Lleva tu nevera al
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    siguiente nivel
                  </span>
                </h1>
                
                <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                  Nunca más desperdicies comida. Organiza tu nevera con inteligencia artificial,
                  ahorra dinero y cuida el planeta.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a 
                    href="/register" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105 text-center"
                  >
                    Solicitar Acceso Gratuito
                  </a>
                  <a 
                    href="/login" 
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-all text-center"
                  >
                    Iniciar Sesión
                  </a>
                </div>

                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-gray-600">+1,247 familias ahorrando</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto w-80 max-w-sm">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    <div className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="flex justify-between items-center mb-6 text-sm font-semibold">
                        <span>9:41</span>
                        <span>🔋 100%</span>
                      </div>

                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl font-bold">N</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">¡Hola, María!</h3>
                        <p className="text-sm text-gray-600">Tienes 3 productos que vencen pronto</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="text-2xl font-bold text-green-600">€147</div>
                          <div className="text-xs text-gray-500">Ahorrado</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">23</div>
                          <div className="text-xs text-gray-500">Productos</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">🥛</span>
                              <div>
                                <div className="font-semibold text-sm">Leche</div>
                                <div className="text-xs text-red-600">Vence hoy</div>
                              </div>
                            </div>
                            <button className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded-lg">
                              ¡Usar ya!
                            </button>
                          </div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">🍅</span>
                              <div>
                                <div className="font-semibold text-sm">Tomates</div>
                                <div className="text-xs text-orange-600">Vence mañana</div>
                              </div>
                            </div>
                            <button className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded-lg">
                              Recetas
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white font-semibold">
              ⚡ Neverafy tarda solo 5 minutos en configurar tu nevera inteligente.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para una nevera inteligente
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Gestión completa de tu nevera con tecnología de inteligencia artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '📸',
                title: 'Escaneo con IA',
                description: 'Saca fotos a los productos y la IA identifica automáticamente fechas de caducidad.'
              },
              {
                icon: '⏰',
                title: 'Alertas Inteligentes',
                description: 'Recibe notificaciones antes de que caduquen tus productos para evitar desperdicios.'
              },
              {
                icon: '🍳',
                title: 'Recetas Personalizadas',
                description: 'Genera recetas con los ingredientes que tienes disponibles en casa.'
              },
              {
                icon: '💰',
                title: 'Ahorro Garantizado',
                description: 'Reduce hasta un 40% el desperdicio de comida y ahorra dinero cada mes.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Familias que ya están ahorrando
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm text-center">
              <div className="flex justify-center text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                "Desde que uso Neverafy he reducido el desperdicio a la mitad. 
                Las alertas me avisan justo a tiempo y las recetas con IA son increíbles."
              </p>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana Martínez</h4>
                  <p className="text-sm text-gray-500">Madre de familia, Madrid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Planes que se adaptan a ti
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Empieza gratis y actualiza cuando necesites más funciones avanzadas
            </p>
          </div>

          <div className="space-y-8 max-w-md mx-auto md:grid md:grid-cols-2 md:gap-8 md:max-w-4xl md:space-y-0">
            {/* Plan Gratuito */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                <p className="text-gray-600 mb-4">Perfecto para empezar</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  0€
                  <span className="text-lg font-normal text-gray-500">/mes</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Hasta 20 productos</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Alertas básicas</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>5 recetas con IA/mes</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Estadísticas básicas</span>
                </li>
              </ul>
              
              <a 
                href="/register" 
                className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:bg-gray-800 text-center block"
              >
                Empezar Gratis
              </a>
            </div>

            {/* Plan Premium - Destacado */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative md:transform md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  ⭐ Más Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-600 mb-4">Para familias activas</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  4,99€
                  <span className="text-lg font-normal text-gray-500">/mes</span>
                </div>
                <p className="text-sm text-gray-500">Facturado mensualmente</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Productos ilimitados</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Alertas inteligentes avanzadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Recetas ilimitadas con IA</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Escaneo automático con OCR</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Lista de compras inteligente</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Estadísticas avanzadas</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              
              <a 
                href="/register?plan=premium" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:scale-105 text-center block"
              >
                Empezar Prueba de 7 Días
              </a>
              <p className="text-xs text-gray-500 text-center mt-2">Luego 4,99€/mes. Cancela cuando quieras.</p>
            </div>
          </div>

          {/* Garantía */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full border border-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Garantía de 30 días - 100% satisfecho o te devolvemos el dinero</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para una nevera inteligente?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a más de 1,000 familias que ya están ahorrando dinero y cuidando el planeta.
          </p>
          <a 
            href="/register" 
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105 inline-block"
          >
            Empezar Gratis Ahora
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">N</span>
                </div>
                <span className="text-xl font-bold">Neverafy</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                La primera app inteligente para gestionar tu nevera y eliminar el desperdicio de comida.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Producto</h3>
              <div className="space-y-3">
                <a href="/login" className="block text-gray-400 hover:text-white transition-colors">Iniciar Sesión</a>
                <a href="/register" className="block text-gray-400 hover:text-white transition-colors">Registrarse</a>
                <a href="/roadmap" className="block text-gray-400 hover:text-white transition-colors">Roadmap</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Soporte</h3>
              <div className="space-y-3">
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacidad</a>
                <a href="/terms" className="block text-gray-400 hover:text-white transition-colors">Términos</a>
                <a href="mailto:hola@neverafy.com" className="block text-gray-400 hover:text-white transition-colors">Contacto</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 Neverafy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageModern;