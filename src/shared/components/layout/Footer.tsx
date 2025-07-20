// shared/components/layout/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`footer ${className}`}>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🥬</div>
              <div>
                <div className="text-xl font-bold text-gray-800">Neverafy</div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-red-600">🇪🇸</span>
                  <span>Hecho en España</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Tu nevera, inteligente. Desarrollado con ❤️ en España para ayudar a las familias
              a reducir el desperdicio alimentario y crear un planeta más sostenible.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:hola@neverafy.com" 
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <span>📧</span>
                <span>hola@neverafy.com</span>
              </a>
              <a 
                href="https://twitter.com/neverafy_es" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <span>📱</span>
                <span>@neverafy_es</span>
              </a>
            </div>
          </div>

          {/* Product Section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/features" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Funciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Precios
                </Link>
              </li>
              <li>
                <Link 
                  to="/#download" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Descargar app
                </Link>
              </li>
              <li>
                <Link 
                  to="/#roadmap" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            © {currentYear} Neverafy. Todos los derechos reservados. Hecho con ❤️ en España.
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>🌍</span>
            <span>Disponible en España • Próximamente en Europa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
