import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CleanLandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const features = [
    {
      icon: '📱',
      title: 'Gestión inteligente',
      description: 'Organiza tu nevera de forma automática y recibe alertas antes de que caduquen tus productos.'
    },
    {
      icon: '📸',
      title: 'Escaneo OCR',
      description: 'Toma fotos de tus tickets de compra y la IA añadirá automáticamente los productos a tu nevera.'
    },
    {
      icon: '🍳',
      title: 'Recetas personalizadas',
      description: 'Genera recetas únicas con los ingredientes que tienes disponibles en casa.'
    },
    {
      icon: '💰',
      title: 'Ahorro garantizado',
      description: 'Reduce el desperdicio alimentario y ahorra hasta 250€ al año en tu cesta de la compra.'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Madre de familia',
      location: 'Madrid',
      text: 'Desde que uso Neverafy he reducido el desperdicio a cero. Ya no se me olvida qué tengo en la nevera.',
      avatar: 'MG',
      savings: '127€ ahorrados'
    },
    {
      name: 'Carlos Martínez',
      role: 'Chef profesional',
      location: 'Barcelona',
      text: 'Las recetas que genera la IA son increíbles. Aprovecho cada ingrediente al máximo.',
      avatar: 'CM',
      savings: '85€ ahorrados'
    },
    {
      name: 'Ana López',
      role: 'Estudiante',
      location: 'Valencia',
      text: 'Perfecto para mi piso compartido. Todos sabemos qué hay y cuándo caduca cada cosa.',
      avatar: 'AL',
      savings: '63€ ahorrados'
    }
  ];

  const faqs = [
    {
      question: '¿Cómo funciona el escaneo OCR?',
      answer: 'Simplemente toma una foto de tu ticket de compra o de los productos. Nuestra IA identifica automáticamente los productos, fechas y precios con precisión del 97%.'
    },
    {
      question: '¿Puedo usar Neverafy sin conexión?',
      answer: 'Puedes consultar tu inventario sin conexión, pero necesitas internet para sincronizar datos y usar funciones de IA como el escaneo y recetas.'
    },
    {
      question: '¿Las recetas se adaptan a mis preferencias?',
      answer: 'Sí, puedes configurar restricciones alimentarias (vegetariano, vegano, sin gluten, etc.) y la IA generará recetas personalizadas.'
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Utilizamos encriptación de nivel bancario y nunca compartimos tus datos personales. Tu privacidad es nuestra prioridad.'
    },
    {
      question: '¿Puedo cancelar cuando quiera?',
      answer: 'Por supuesto. No hay permanencia ni compromisos. Puedes cancelar tu suscripción en cualquier momento desde tu perfil.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">Neverafy</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Funciones
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonios
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Precios
              </a>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Empezar Gratis
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              <a href="#features" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Funciones
              </a>
              <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Testimonios
              </a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Precios
              </a>
              <Link to="/login" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center"
              >
                Empezar Gratis
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Resto del contenido continúa... */}
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Tu nevera, <span className="text-blue-600">inteligente</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Organiza tu nevera, ahorra dinero y cuida el planeta. Nunca más desperdicies comida.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">¿Te suena familiar?</h3>
                <div className="space-y-3">
                  {[
                    'Se te olvida qué tienes en la nevera',
                    'Compras cosas que ya tenías en casa',
                    'Descubres comida caducada',
                    'Desperdicias 250€ de comida al año'
                  ].map((problem, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        ×
                      </div>
                      <span className="text-gray-700">{problem}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors"
                >
                  Empezar Gratis
                </Link>
                <Link 
                  to="/login" 
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-center hover:border-gray-400 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★★</span>
                  <span>4.9/5</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-600">+1,200</span> familias ahorrando
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 bg-gray-900 rounded-3xl p-2 shadow-2xl" style={{height: '640px'}}>
                  <div className="h-full bg-gray-50 rounded-3xl p-6 overflow-hidden">
                    {/* Phone Status Bar */}
                    <div className="flex justify-between items-center mb-6 text-sm font-medium">
                      <span>9:41</span>
                      <span>100%</span>
                    </div>

                    {/* App Header */}
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900">Neverafy</h3>
                      <p className="text-sm text-gray-500">Tu nevera inteligente</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-xl font-bold text-blue-600">127€</div>
                        <div className="text-xs text-gray-500">Ahorrados</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                        <div className="text-xl font-bold text-gray-900">23</div>
                        <div className="text-xs text-gray-500">Productos</div>
                      </div>
                    </div>

                    {/* Product List */}
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border-l-4 border-green-500 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">🥛 Leche</span>
                          <span className="text-xs text-gray-500">3 días</span>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-500">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">🍅 Tomates</span>
                          <span className="text-xs text-amber-600">Mañana</span>
                        </div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">🧀 Queso</span>
                          <span className="text-xs text-red-600">¡Hoy!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 shadow-lg border border-gray-200">
                  IA Integrada
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-green-600 shadow-lg border border-gray-200">
                  OCR Avanzado
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu nevera
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gestión inteligente con tecnología de vanguardia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Más de 1,200 familias ya están ahorrando dinero
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
                <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  {testimonial.savings}
                </div>

                <div className="flex items-center gap-1 mb-4 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-sm text-gray-400">📍 {testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-16 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Rating promedio</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-gray-900 mb-2">1,247</div>
              <div className="text-sm text-gray-600">Usuarios activos</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">127€</div>
              <div className="text-sm text-gray-600">Ahorro promedio</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
              <div className="text-sm text-gray-600">Menos desperdicio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Precios simples y transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Elige el plan que mejor se adapte a ti
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratis</h3>
                <p className="text-gray-600 mb-6">Perfecto para empezar</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">0€</div>
                <div className="text-gray-500">para siempre</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Hasta 20 productos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Alertas de vencimiento</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">3 escaneos OCR/mes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Estadísticas básicas</span>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-xl font-semibold text-center block hover:bg-gray-200 transition-colors"
              >
                Empezar Gratis
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-xl border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  MÁS POPULAR
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-600 mb-6">Para familias que quieren todo</p>
                <div className="text-4xl font-bold text-gray-900 mb-2">4.99€</div>
                <div className="text-gray-500">por mes</div>
                <div className="text-sm text-blue-600 font-semibold mt-2">
                  7 días gratis, luego 4.99€/mes
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Productos ILIMITADOS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">OCR ilimitado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Recetas personalizadas IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Analytics avanzados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Nevera familiar compartida</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-gray-700">Soporte prioritario 24/7</span>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-center block hover:bg-blue-700 transition-colors"
              >
                Probar 7 días GRATIS
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                Sin compromiso • Cancela cuando quieras
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <span>↩️</span>
              <span>30 días garantía</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🇪🇸</span>
              <span>Empresa española</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos tus dudas sobre Neverafy
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-2xl text-gray-400">
                    {selectedFaq === index ? '−' : '+'}
                  </span>
                </button>
                {selectedFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para empezar?</h2>
          <p className="text-xl mb-12 text-blue-100 max-w-2xl mx-auto">
            Únete a más de 1,200 familias que ya están ahorrando dinero y cuidando el planeta
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Empezar Gratis Ahora
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
          
          <div className="flex justify-center gap-8 mt-12 text-blue-200 text-sm">
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
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-semibold">Neverafy</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                La primera app inteligente para gestionar tu nevera y eliminar el desperdicio de comida.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">
                  Funciones
                </a>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="block text-gray-400 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Centro de ayuda
                </a>
                <a href="mailto:hola@neverafy.com" className="block text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Privacidad
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Neverafy. Todos los derechos reservados.</p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Disponible en España
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanLandingPage;