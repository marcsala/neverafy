import React from 'react';

const Pricing = () => (
  <div className="container mx-auto p-4">
    <section className="pricing-section" id="pricing">
        <div className="container">
            <div className="section-header animate-on-scroll">
                <div className="section-badge" style={{color: "#2563eb"}}>
                    <span style={{color: "#2563eb"}}>⚡</span>
                    Planes transparentes
                </div>
                <h2 className="section-title">
                    Elige tu <span className="gradient-text">plan perfecto</span>
                </h2>
                <p className="section-description">
                    Empieza gratis y actualiza cuando quieras más poder
                </p>
            </div>

            <div className="pricing-grid">
                <div className="pricing-card animate-on-scroll">
                    <h3 className="pricing-title">Gratuito</h3>
                    <div className="pricing-price free">0€</div>
                    <div className="pricing-period">Para siempre</div>

                    <div className="pricing-features">
                        <div className="pricing-feature">
                            <span className="feature-icon-check">✅</span>
                            <span>Hasta 15 productos</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">📸</span>
                            <span>3 escaneos IA/mes</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">🍳</span>
                            <span>5 recetas IA/mes</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">🔔</span>
                            <span>Alertas básicas</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-cross">❌</span>
                            <span style={{color: "#9ca3af"}}>Analytics avanzados</span>
                        </div>
                    </div>

                    <button className="pricing-cta free">
                        Empezar Gratis
                    </button>
                </div>

                <div className="pricing-card featured animate-on-scroll" style={{animationDelay: "0.1s"}}>
                    <div className="pricing-badge">🔥 Más Popular</div>
                    <h3 className="pricing-title">Premium</h3>
                    <div className="pricing-price premium">4.99€</div>
                    <div className="pricing-period">por mes</div>

                    <div className="pricing-features">
                        <div className="pricing-feature">
                            <span className="feature-icon-check">♾️</span>
                            <span>Productos ilimitados</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">📸</span>
                            <span>Escaneos IA ilimitados</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">🍳</span>
                            <span>Recetas IA ilimitadas</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">📊</span>
                            <span>Analytics completos</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">🏆</span>
                            <span>Gamificación completa</span>
                        </div>
                    </div>

                    <button className="pricing-cta premium">
                        Probar Premium
                    </button>

                    <div className="pricing-note">
                        💰 Se paga solo: ahorra más de 50€/mes
                    </div>
                </div>

                <div className="pricing-card animate-on-scroll" style={{animationDelay: "0.2s"}}>
                    <h3 className="pricing-title">Familiar</h3>
                    <div className="pricing-price family">8.99€</div>
                    <div className="pricing-period">por mes</div>

                    <div className="pricing-features">
                        <div className="pricing-feature">
                            <span className="feature-icon-check">✅</span>
                            <span>Todo lo de Premium</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">👥</span>
                            <span>Hasta 4 usuarios</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">🏠</span>
                            <span>Dashboard familiar</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">⚡</span>
                            <span>Competencias familiares</span>
                        </div>
                        <div className="pricing-feature">
                            <span className="feature-icon-check">📝</span>
                            <span>Lista compartida</span>
                        </div>
                    </div>

                    <button className="pricing-cta family">
                        Probar Familiar
                    </button>
                </div>
            </div>

            <div className="guarantee animate-on-scroll">
                <div className="guarantee-badge">
                    <span style={{fontSize: "24px"}}>🛡️</span>
                    <span>Garantía de 14 días - 100% satisfecho o te devolvemos el dinero</span>
                </div>
            </div>
        </div>
    </section>
  </div>
);

export default Pricing;
