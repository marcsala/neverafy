import React from 'react';

const Features = () => (
  <div className="container mx-auto p-4">
    <section className="features-section" id="features">
        <div className="container">
            <div className="section-header animate-on-scroll">
                <div className="section-badge" style={{color: "#2563eb"}}>
                    <span style={{color: "#2563eb"}}>⚡</span>
                    Súper simple
                </div>
                <h2 className="section-title">
                    <span className="gradient-text">3 pasos</span> para nunca más desperdiciar
                </h2>
                <p className="section-description">
                    Transforma tu nevera en un asistente inteligente en menos de 2 minutos
                </p>
            </div>

            <div className="steps-grid">
                <div className="step-card animate-on-scroll">
                    <div className="step-number-container">
                        <div className="step-number">1</div>
                        <div className="step-bg-icon">📸</div>
                    </div>
                    <h3 className="step-title">Escanea con IA</h3>
                    <p className="step-description">
                        Haz una foto a tus productos. Nuestra <strong>IA avanzada</strong> reconoce automáticamente
                        el producto y su fecha de vencimiento. <span style={{color: "var(--primary-green)", fontWeight: "600"}}>¡Magia!</span>
                    </p>
                    <div className="step-stats">
                        <div className="step-stat-number">Precisión del 94%</div>
                        <div className="step-stat-label">Mejorando constantemente</div>
                    </div>
                </div>

                <div className="step-card animate-on-scroll" style={{animationDelay: "0.1s"}}>
                    <div className="step-number-container">
                        <div className="step-number">2</div>
                        <div className="step-bg-icon">🔔</div>
                    </div>
                    <h3 className="step-title">Recibe alertas smart</h3>
                    <p className="step-description">
                        Te avisamos en el momento perfecto, adaptándonos a tus horarios.
                        <strong>Nunca más</strong> encontrarás sorpresas desagradables en tu nevera.
                    </p>
                    <div className="step-stats">
                        <div className="step-stat-number">Alertas personalizadas</div>
                        <div className="step-stat-label">Se adaptan a tu rutina</div>
                    </div>
                </div>

                <div className="step-card animate-on-scroll" style={{animationDelay: "0.2s"}}>
                    <div className="step-number-container">
                        <div className="step-number">3</div>
                        <div className="step-bg-icon">🍳</div>
                    </div>
                    <h3 className="step-title">Cocina con IA</h3>
                    <p className="step-description">
                        Te sugerimos <strong>recetas deliciosas</strong> usando exactamente lo que tienes en casa.
                        Aprovecha cada ingrediente y descubre nuevos sabores.
                    </p>
                    <div className="step-stats">
                        <div className="step-stat-number">1000+ recetas</div>
                        <div className="step-stat-label">Personalizadas para ti</div>
                    </div>
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card animate-on-scroll">
                    <div className="feature-icon">📱</div>
                    <h3 className="feature-title">Escáner IA Ultra-Preciso</h3>
                    <p className="feature-description">
                        Reconoce productos y fechas con 94% de precisión. Tecnología de última generación que mejora cada día.
                    </p>
                    <div className="feature-highlight">Powered by Claude AI</div>
                </div>

                <div className="feature-card animate-on-scroll" style={{animationDelay: "0.1s"}}>
                    <div className="feature-icon">🧠</div>
                    <h3 className="feature-title">Recetas IA Personalizadas</h3>
                    <p className="feature-description">
                        IA que crea recetas únicas usando exactamente lo que tienes. Nunca te quedarás sin ideas culinarias.
                    </p>
                    <div className="feature-highlight">1000+ combinaciones</div>
                </div>

                <div className="feature-card animate-on-scroll" style={{animationDelay: "0.2s"}}>
                    <div className="feature-icon">📊</div>
                    <h3 className="feature-title">Analytics de Impacto</h3>
                    <p className="feature-description">
                        Ve cuánto dinero y CO2 has ahorrado. Datos que te motivan a seguir mejorando cada día.
                    </p>
                    <div className="feature-highlight">Reportes detallados</div>
                </div>

                <div className="feature-card animate-on-scroll" style={{animationDelay: "0.3s"}}>
                    <div className="feature-icon">🔔</div>
                    <h3 className="feature-title">Notificaciones Smart</h3>
                    <p className="feature-description">
                        Alertas que se adaptan a tu rutina y horarios. Recibe avisos en el momento perfecto.
                    </p>
                    <div className="feature-highlight">Horarios personalizados</div>
                </div>

                <div className="feature-card animate-on-scroll" style={{animationDelay: "0.4s"}}>
                    <div className="feature-icon">🏆</div>
                    <h3 className="feature-title">Gamificación Divertida</h3>
                    <p className="feature-description">
                        Logros, puntos y desafíos que hacen divertido cuidar tu nevera y contribuir al planeta.
                    </p>
                    <div className="feature-highlight">Niveles y recompensas</div>
                </div>

                <div className="feature-card animate-on-scroll" style={{animationDelay: "0.5s"}}>
                    <div className="feature-icon">👨‍👩‍👧‍👦</div>
                    <h3 className="feature-title">Perfecto para Familias</h3>
                    <p className="feature-description">
                        Toda la familia puede colaborar. Nevera compartida, responsabilidad compartida, planeta cuidado.
                    </p>
                    <div className="feature-highlight">Hasta 4 usuarios</div>
                </div>
            </div>
        </div>
    </section>
  </div>
);

export default Features;
