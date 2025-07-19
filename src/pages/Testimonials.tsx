import React from 'react';

const Testimonials = () => (
  <div className="container mx-auto p-4">
    <section className="testimonials-section" id="testimonials">
        <div className="container">
            <div className="section-header animate-on-scroll">
                <div className="section-badge" style={{color: "#16a34a"}}>
                    <span style={{color: "#16a34a"}}>❤️</span>
                    Historias reales
                </div>
                <h2 className="section-title">
                    Lo que dicen nuestros <span className="gradient-text">usuarios</span>
                </h2>
                <p className="section-description">
                    Más de 1,200 familias ya han transformado su relación con la comida
                </p>
            </div>

            <div className="testimonials-grid">
                <div className="testimonial-card animate-on-scroll">
                    <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    <p className="testimonial-text">
                        "Desde que uso Neverafy, mi familia ahorra más de <strong>180€ al mes</strong>.
                        La función de recetas IA es increíble, siempre encuentra algo delicioso que hacer con lo que tenemos."
                    </p>
                    <div className="testimonial-author">
                        <div className="author-avatar">M</div>
                        <div className="author-info">
                            <div className="author-name">María González</div>
                            <div className="author-details">Madre de familia • Madrid</div>
                        </div>
                    </div>
                </div>

                <div className="testimonial-card animate-on-scroll" style={{animationDelay: "0.1s"}}>
                    <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    <p className="testimonial-text">
                        "Como estudiante, cada euro cuenta. Neverafy me ha ayudado a reducir el desperdicio y <strong>comer mejor con menos dinero</strong>.
                        El escáner por cámara es súper rápido."
                    </p>
                    <div className="testimonial-author">
                        <div className="author-avatar" style={{background: "linear-gradient(45deg, #3b82f6, #2563eb)"}}>C</div>
                        <div className="author-info">
                            <div className="author-name">Carlos Ruiz</div>
                            <div className="author-details">Estudiante • Barcelona</div>
                        </div>
                    </div>
                </div>

                <div className="testimonial-card animate-on-scroll" style={{animationDelay: "0.2s"}}>
                    <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                    <p className="testimonial-text">
                        "La app es súper intuitiva. Me encanta ver cuánto CO2 he ahorrado cada mes.
                        <strong>Mis nietos están orgullosos</strong> de su abuela eco-friendly. ¡Es genial!"
                    </p>
                    <div className="testimonial-author">
                        <div className="author-avatar" style={{background: "linear-gradient(45deg, #a855f7, #7c3aed)"}}>A</div>
                        <div className="author-info">
                            <div className="author-name">Ana Martín</div>
                            <div className="author-details">Jubilada • Valencia</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-banner animate-on-scroll">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-big-number">1,247+</span>
                        <div className="stat-big-label">Familias activas</div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-big-number">47k€</span>
                        <div className="stat-big-label">Ahorrados en total</div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-big-number">8.2T</span>
                        <div className="stat-big-label">CO2 evitado</div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-big-number">4.9⭐</span>
                        <div className="stat-big-label">Valoración media</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
);

export default Testimonials;
