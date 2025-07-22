#!/bin/bash

# 🧪 NEVERAFY - Script de Testing Completo
# Verifica que toda la migración funcione correctamente

echo "🚀 === TESTING NEVERAFY MIGRACIÓN === 🚀"
echo ""

echo "📁 1. Verificando estructura de archivos..."
if [ -f "src/App.tsx" ]; then
    echo "✅ App.tsx existe"
else
    echo "❌ App.tsx no encontrado"
    exit 1
fi

if [ -d "src/features" ]; then
    echo "✅ Carpeta features existe"
else
    echo "❌ Carpeta features no encontrada"
    exit 1
fi

if [ -d "src/shared" ]; then
    echo "✅ Carpeta shared existe"
else
    echo "❌ Carpeta shared no encontrada"
    exit 1
fi

echo ""
echo "📦 2. Instalando dependencias..."
npm install

echo ""
echo "🔧 3. Verificando compilación TypeScript..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compila sin errores"
else
    echo "❌ Errores de TypeScript encontrados"
    echo "🔍 Ejecuta: npx tsc --noEmit para ver detalles"
fi

echo ""
echo "⚡ 4. Intentando build de producción..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build de producción exitoso"
else
    echo "❌ Build de producción falló"
    echo "🔍 Revisa los errores arriba"
fi

echo ""
echo "🎉 Testing completado!"
echo ""
echo "Para probar en desarrollo:"
echo "  npm run dev"
echo ""
echo "Para ver build:"
echo "  npm run preview"