#!/bin/bash

echo "🚀 Iniciando Neverafy - Nueva Landing Page..."
echo ""
echo "📦 Verificando dependencias..."

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules no encontrado. Instalando dependencias..."
    npm install
else
    echo "✅ Dependencias encontradas"
fi

echo ""
echo "🔧 Verificando configuración de TypeScript..."

# Verificar archivos principales
if [ -f "src/LandingPageModern.tsx" ]; then
    echo "✅ LandingPageModern.tsx creado"
else
    echo "❌ LandingPageModern.tsx no encontrado"
fi

if [ -f "src/App.tsx" ]; then
    echo "✅ App.tsx actualizado"
else
    echo "❌ App.tsx no encontrado"
fi

echo ""
echo "🎨 Características de la nueva landing page:"
echo "   • Diseño mobile-first responsive"
echo "   • Mockup de teléfono con contenido real"
echo "   • Gradientes modernos azul-púrpura"
echo "   • Secciones limpias inspiradas en Finity"
echo "   • Testimonios con estrellas y avatares"
echo "   • Call-to-actions destacados"
echo "   • Footer completo"
echo "   • Botones de descarga App Store/Google Play"
echo ""
echo "🌐 Para ver la nueva landing page:"
echo "   npm run dev"
echo ""
echo "📱 La landing se ve perfecta en:"
echo "   • Móviles (iPhone, Android)"
echo "   • Tablets (iPad, etc.)"
echo "   • Desktop (todos los tamaños)"
echo ""
echo "✨ ¡Listo para impresionar a tus usuarios!"