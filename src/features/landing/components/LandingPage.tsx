import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sección de Testimonios
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "María González",
      avatar: "https://ui-avatars.com/api/?name=MG&background=16a34a&color=fff&size=80",
      rating: 5,
      text: "He ahorrado más de 150€ en 3 meses. Ya no se me olvida nada en la nevera y las recetas IA son increíbles. Mi familia está encantada.",
      location: "Madrid",
      savings: "150€ ahorrados",
      role: "Madre de familia"
    },
    {
      name: "Carlos Martínez",
      avatar: "https://ui-avatars.com/api/?name=CM&background=2563eb&color=fff&size=80",
      rating: 5,
      text: "Como chef profesional, me encanta cómo Neverafy me ayuda a aprovechar cada ingrediente. Las recetas IA son sorprendentemente creativas.",
      location: "Barcelona",
      savings: "80€ ahorrados",
      role: "Chef profesional"
    },
    {
      name: "Ana López",
      avatar: "https://ui-avatars.com/api/?name=AL&background=dc2626&color=fff&size=80",
      rating: 5,
      text: "Desde que uso Neverafy, mi huella de carbono ha bajado un 30%. Es genial saber que estoy ayudando al planeta mientras ahorro dinero.",
      location: "Valencia",
      savings: "95€ ahorrados",
      role: "Consultora ambiental"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 text-sm font-semibold mb-6 border border-white/30">
            <span className="text-xl">💬</span>
            Testimonios
          </div>
          <h2 className="text-5xl font-black mb-6">Lo que dicen nuestros usuarios</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Más de 1,000 familias ya están ahorrando dinero y cuidando el planeta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:shadow-xl transition-all hover:scale-105 relative"
            >
              <div className="absolute -top-4 left-8 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                {testimonial.savings}
              </div>

              <div className="flex items-center gap-1 mb-6 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 text-lg italic">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full shadow-lg"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <span>📍</span> {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="text-3xl font-black text-green-600 mb-2">4.9/5</div>
            <div className="text-sm text-gray-600">Rating promedio</div>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="text-3xl font-black text-blue-600 mb-2">1,247</div>
            <div className="text-sm text-gray-600">Usuarios activos</div>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="text-3xl font-black text-purple-600 mb-2">127€</div>
            <div className="text-sm text-gray-600">Ahorro promedio</div>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/30">
            <div className="text-3xl font-black text-orange-600 mb-2">89%</div>
            <div className="text-sm text-gray-600">Menos desperdicio</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sección de Precios
const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Gratis",
      description: "Perfecto para empezar",
      price: "0€",
      period: "siempre",
      originalPrice: null,
      features: [
        "Hasta 20 productos en nevera",
        "Notificaciones básicas de vencimiento",
        "3 escaneos OCR por mes",
        "Estadísticas básicas",
        "Recetas sugeridas básicas",
        "Soporte por email"
      ],
      limitations: [
        "Máximo 20 productos",
        "Solo 3 escaneos/mes",
        "Sin recetas IA personalizadas"
      ],
      ctaText: "Empezar Gratis",
      ctaVariant: "secondary",
      popular: false
    },
    {
      name: "Premium",
      description: "Para familias que quieren aprovechar todo",
      price: isAnnual ? "3.99€" : "4.99€",
      period: "mes",
      originalPrice: isAnnual ? "4.99€" : null,
      features: [
        "Productos ILIMITADOS en nevera",
        "OCR ilimitado con IA avanzada",
        "Recetas personalizadas con IA",
        "Analytics avanzados y trends",
        "Exportar datos (CSV, PDF)",
        "Compartir nevera familiar",
        "Notificaciones push personalizadas",
        "Soporte prioritario 24/7",
        "Integración con supermercados",
        "Modo sin conexión"
      ],
      limitations: [],
      ctaText: "Probar 7 días GRATIS",
      ctaVariant: "primary",
      popular: true,
      badge: "MÁS POPULAR",
      trial: "7 días gratis, luego "
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 text-sm font-semibold mb-6 border border-white/30">
            <span className="text-xl">💰</span>
            Precios
          </div>
          <h2 className="text-5xl font-black mb-6">Simple y transparente</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Elige el plan que mejor se adapte a tu familia. Siempre puedes cambiar después.
          </p>

          <div className="inline-flex items-center gap-4 bg-gray-100 rounded-2xl p-2 mb-12">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                !isAnnual 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                isAnnual 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              {isAnnual && (
                <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-3xl border-2 transition-all hover:shadow-xl hover:scale-105 ${
                plan.popular 
                  ? 'border-green-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-2xl text-sm font-bold shadow-lg">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-5xl font-black text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    {plan.trial && (
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        {plan.trial}{plan.price}/{plan.period}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold mb-4 text-gray-900">✅ Incluye:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-bold mb-4 text-gray-900">⚠️ Limitaciones:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-start gap-3">
                            <span className="w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                              !
                            </span>
                            <span className="text-gray-600 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link
                  to="/register"
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  {plan.ctaVariant === 'primary' ? '🚀' : '👋'}
                  {plan.ctaText}
                </Link>

                {plan.name === 'Premium' && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Sin compromiso • Cancela cuando quieras
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-10 mt-16 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-500">🔒</span>
            <span>Pago 100% seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">↩️</span>
            <span>30 días garantía</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">🇪🇸</span>
            <span>Empresa española</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 mt-16">
          <h3 className="text-xl font-bold text-center mb-6">Preguntas frecuentes sobre precios</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">¿Puedo cambiar de plan después?</h4>
              <p className="text-gray-600">Sí, puedes subir o bajar de plan en cualquier momento desde tu perfil.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Qué incluye la prueba gratis?</h4>
              <p className="text-gray-600">7 días completos con todas las funciones Premium. Sin restricciones.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Puedo cancelar cuando quiera?</h4>
              <p className="text-gray-600">Por supuesto. Sin permanencia ni compromisos. Cancela con un clic.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">¿Aceptáis Bizum?</h4>
              <p className="text-gray-600">Sí, aceptamos Bizum, tarjetas y transferencias bancarias.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
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
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Empezar Gratis
            </Link>
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
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
              >
                <span className="text-2xl">🚀</span>
                Empezar Gratis
              </Link>
              <Link 
                to="/login" 
                className="bg-white/90 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all hover:scale-105 border-2 border-white/30 flex items-center gap-3"
              >
                <span className="text-2xl">👤</span>
                Iniciar Sesión
              </Link>
              <button 
                onClick={() => {
                  // Scroll to features
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/90 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all hover:scale-105 border-2 border-white/30"
              >
                Ver Cómo Funciona
              </button>
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
            <div className="relative w-80 h-160 animate-float">
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

              {/* Floating badges */}
              <div className="absolute -top-10 -right-10 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 text-sm font-semibold text-green-600 border border-white/30 animate-float">
                IA Integrada
              </div>
              <div 
                className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 text-sm font-semibold text-blue-600 border border-white/30 animate-float" 
                style={{ animationDelay: '2s' }}
              >
                OCR Avanzado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
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

      {/* Pricing Section */}
      <PricingSection />

      {/* Stats Banner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-16 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-12">Resultados que hablan</h2>
              <div className="grid md:grid-cols-3 gap-10">
                <div>
                  <div className="text-5xl font-black mb-2">127€</div>
                  <div className="text-white/80 font-medium">Promedio ahorrado/mes</div>
                </div>
                <div>
                  <div className="text-5xl font-black mb-2">89%</div>
                  <div className="text-white/80 font-medium">Menos desperdicio</div>
                </div>
                <div>
                  <div className="text-5xl font-black mb-2">1.2K</div>
                  <div className="text-white/80 font-medium">Familias felices</div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 text-sm font-semibold mb-6 border border-white/30">
              <span className="text-xl">❓</span>
              FAQ
            </div>
            <h2 className="text-5xl font-black mb-6">Preguntas frecuentes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Resolvemos tus dudas sobre Neverafy
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: '¿Cómo funciona el escaneo OCR?',
                answer: 'Simplemente toma una foto de tus productos o tickets de compra. Nuestra IA avanzada identifica automáticamente los productos, fechas de caducidad y precios con una precisión del 97%.'
              },
              {
                question: '¿Puedo usar Neverafy sin conexión a internet?',
                answer: 'Neverafy funciona principalmente online para sincronizar tus datos entre dispositivos. Sin embargo, puedes consultar tu inventario y recibir alertas básicas sin conexión.'
              },
              {
                question: '¿Las recetas se adaptan a mis restricciones alimentarias?',
                answer: 'Sí, puedes configurar tus preferencias dietéticas (vegetariano, vegano, sin gluten, etc.) y la IA generará recetas personalizadas que se adapten a tus necesidades.'
              },
              {
                question: '¿Qué pasa si no estoy satisfecho?',
                answer: 'Ofrecemos 30 días de garantía de devolución sin preguntas. Además, siempre puedes usar la versión gratuita que incluye las funciones básicas.'
              },
              {
                question: '¿Mis datos están seguros?',
                answer: 'Absolutamente. Utilizamos encriptación SSL de nivel bancario y nunca compartimos tus datos personales con terceros. Tu privacidad es nuestra prioridad.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden">
                <button 
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    const answer = e.currentTarget.nextElementSibling as HTMLElement;
                    const arrow = e.currentTarget.querySelector('.faq-arrow') as HTMLElement;
                    
                    if (answer && answer.style.display === 'block') {
                      answer.style.display = 'none';
                      arrow.innerHTML = '🔽';
                    } else if (answer) {
                      // Close all other FAQs
                      const allAnswers = document.querySelectorAll('.faq-answer') as NodeListOf<HTMLElement>;
                      const allArrows = document.querySelectorAll('.faq-arrow') as NodeListOf<HTMLElement>;
                      allAnswers.forEach(ans => ans.style.display = 'none');
                      allArrows.forEach(arr => arr.innerHTML = '🔽');
                      
                      // Open this FAQ
                      answer.style.display = 'block';
                      arrow.innerHTML = '🔼';
                    }
                  }}
                >
                  <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                  <span className="faq-arrow text-2xl text-gray-400">🔽</span>
                </button>
                <div className="faq-answer px-8 pb-6 text-gray-600 leading-relaxed" style={{ display: 'none' }}>
                  {faq.answer}
                </div>
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
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-10 py-5 rounded-2xl font-black text-xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3"
            >
              <span className="text-2xl">🚀</span>
              Empezar Gratis Ahora
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white hover:text-green-600 transition-all flex items-center gap-3"
            >
              <span className="text-2xl">👤</span>
              Iniciar Sesión
            </Link>
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
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Funciones</a>
                <Link to="/login" className="block text-gray-400 hover:text-white transition-colors">Iniciar Sesión</Link>
                <Link to="/register" className="block text-gray-400 hover:text-white transition-colors">Registrarse</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Soporte</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Centro de ayuda</a>
                <a href="mailto:hola@neverafy.com" className="block text-gray-400 hover:text-white transition-colors">Contacto</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacidad</a>
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

export default LandingPage;
