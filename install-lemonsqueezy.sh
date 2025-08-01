#!/bin/bash

echo "🍋 Instalando LemonSqueezy SDK y dependencias..."

# Instalar LemonSqueezy SDK oficial
npm install @lemonsqueezy/lemonsqueezy.js

# Instalar dependencias adicionales para webhooks y validación
npm install stripe  # Para validar webhooks (similar a LemonSqueezy)
npm install crypto  # Para validación de webhooks

echo "✅ Dependencias instaladas correctamente"
echo "🔧 Ahora actualiza tu .env con las credenciales de LemonSqueezy"
