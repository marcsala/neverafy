import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Componente ultra simple
const TestApp = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4, #dbeafe)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥬</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        Neverafy
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#6b7280', marginBottom: '2rem' }}>
        Tu nevera, inteligente - 250€ ahorrados al año
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a 
          href="/login" 
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Iniciar Sesión
        </a>
        <a 
          href="/register" 
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Empezar Gratis
        </a>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#9ca3af' }}>
        <a href="/roadmap" style={{ margin: '0 1rem', color: '#6b7280' }}>Roadmap</a>
        <a href="/privacy" style={{ margin: '0 1rem', color: '#6b7280' }}>Privacidad</a>
        <a href="/terms" style={{ margin: '0 1rem', color: '#6b7280' }}>Términos</a>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af' }}>
        Test version - Si ves esto, React funciona correctamente
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<TestApp />)
