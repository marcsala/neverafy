import React from 'react';

const HelpCenter = () => (
  <div className="container mx-auto p-4">
    <section className="faq-section">
        <div className="container">
            <div className="faq-container">
                <div className="section-header animate-on-scroll">
                    <h2 className="section-title">
                        Preguntas <span className="gradient-text">frecuentes</span>
                    </h2>
                    <p className="section-description">Resolvemos tus dudas antes de empezar</p>
                </div>

                <div className="faq-list">
                    <div className="faq-item animate-on-scroll">
                        <button className="faq-question" onClick={() => {}}>
                            <span>¿Realmente funciona el reconocimiento por cámara?</span>
                            <span className="faq-arrow">🔽</span>
                        </button>
                        <div className="faq-answer" id="faq-1">
                            <p>
                                Sí, utilizamos tecnología de IA de última generación que reconoce productos y fechas con más del <strong>94% de precisión</strong>.
                                Si no detecta algo correctamente, siempre puedes editarlo manually en segundos.
                            </p>
                        </div>
                    </div>

                    <div className="faq-item animate-on-scroll" style={{animationDelay: "0.1s"}}>
                        <button className="faq-question" onClick={() => {}}>
                            <span>¿Puedo cancelar mi suscripción en cualquier momento?</span>
                            <span className="faq-arrow">🔽</span>
                        </button>
                        <div className="faq-answer" id="faq-2">
                            <p>
                                Por supuesto. Puedes cancelar tu suscripción Premium o Familiar en cualquier momento desde la app.
                                <strong>No hay permanencia ni penalizaciones.</strong> Tu plan gratuito seguirá funcionando siempre.
                            </p>
                        </div>
                    </div>

                    <div className="faq-item animate-on-scroll" style={{animationDelay: "0.2s"}}>
                        <button className="faq-question" onClick={() => {}}>
                            <span>¿Funciona sin conexión a internet?</span>
                            <span className="faq-arrow">🔽</span>
                        </button>
                        <div className="faq-answer" id="faq-3">
                            <p>
                                Las funciones básicas como ver tu lista de productos y recibir alertas funcionan perfectamente sin internet.
                                Para el escáner IA y la generación de recetas sí necesitas conexión.
                            </p>
                        </div>
                    </div>

                    <div className="faq-item animate-on-scroll" style={{animationDelay: "0.3s"}}>
                        <button className="faq-question" onClick={() => {}}>
                            <span>¿Cuánto dinero puedo ahorrar realmente?</span>
                            <span className="faq-arrow">🔽</span>
                        </button>
                        <div className="faq-answer" id="faq-4">
                            <p>
                                Nuestros usuarios ahorran de media entre <strong>120-250€ al mes</strong> reduciendo el desperdicio alimentario.
                                El plan Premium (4.99€/mes) se paga solo con el primer producto que evitas tirar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
);

export default HelpCenter;
