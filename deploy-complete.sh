#!/bin/bash

# ===============================================
# SCRIPT DE DEPLOY COMPLETO - NEVERAFY
# ===============================================

echo "🚀 PREPARANDO DEPLOY DE NEVERAFY"
echo "================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar que estamos in el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No estás en el directorio del proyecto${NC}"
    echo "Ejecuta: cd /Users/marc/neverafy"
    exit 1
fi

echo -e "${GREEN}✅ Directorio del proyecto verificado${NC}"

# 2. Verificar configuración local
echo -e "${BLUE}🔧 Verificando configuración...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Archivo .env.local no existe${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivo .env.local existe${NC}"

# 3. Verificar build local
echo -e "${BLUE}🏗️ Verificando build...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build local${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build local exitoso${NC}"

# 4. Deploy a Vercel
echo -e "${BLUE}🚀 Desplegando a Vercel...${NC}"
vercel --prod

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el deploy${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deploy exitoso${NC}"

# 5. Recordatorios importantes
echo ""
echo -e "${YELLOW}📋 RECORDATORIOS POST-DEPLOY:${NC}"
echo ""
echo "1. 🔧 Configurar variables de entorno en Vercel:"
echo "   - Ve a vercel.com → Tu proyecto → Settings → Environment Variables"
echo "   - Añade TODAS las variables de tu .env.local"
echo ""
echo "2. 🧪 Probar el sistema de emails:"
echo "   - Ve a tu URL de producción"
echo "   - Logueate con tu usuario"
echo "   - Busca 'Test de Emails' en el dashboard"
echo "   - Envía un email de prueba"
echo ""
echo "3. ⏰ Verificar cron job:"
echo "   - El cron job se ejecutará automáticamente a las 9 AM"
echo "   - Puedes probarlo manualmente desde el dashboard"
echo ""
echo -e "${GREEN}🎉 ¡NEVERAFY ESTÁ LISTO PARA LANZAR!${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Configurar variables en Vercel"
echo "2. Probar emails en producción"
echo "3. Invitar beta testers"
echo "4. ¡Lanzar la beta!"
