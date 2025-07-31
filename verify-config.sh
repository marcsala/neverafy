#!/bin/bash

# 🔍 VERIFICADOR DE CONFIGURACIÓN DE NEVERAFY
# Script para verificar que todas las variables de entorno estén correctas

echo "🚀 VERIFICANDO CONFIGURACIÓN DE NEVERAFY..."
echo "============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# Función para verificar variable
check_var() {
    local var_name=$1
    local var_value=$2
    local is_required=$3
    
    if [ -z "$var_value" ]; then
        if [ "$is_required" = "true" ]; then
            echo -e "${RED}❌ $var_name: NO CONFIGURADA (REQUERIDA)${NC}"
            ((ERRORS++))
        else
            echo -e "${YELLOW}⚠️  $var_name: No configurada (opcional)${NC}"
        fi
    else
        if [[ $var_value == *"tu_"* ]] || [[ $var_value == *"xxxxxxxxxx"* ]]; then
            echo -e "${RED}❌ $var_name: Valor por defecto (cambiar)${NC}"
            ((ERRORS++))
        else
            echo -e "${GREEN}✅ $var_name: Configurada${NC}"
        fi
    fi
}

echo -e "${BLUE}📝 Verificando archivo .env.local...${NC}"

# Verificar si existe .env.local
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Archivo .env.local no existe!${NC}"
    echo -e "${YELLOW}💡 Ejecuta: cp .env.example .env.local${NC}"
    exit 1
fi

# Cargar variables del .env.local
if [ -f .env.local ]; then
    source .env.local
fi

echo -e "${BLUE}🤖 Verificando Claude API...${NC}"
check_var "VITE_CLAUDE_API_KEY" "$VITE_CLAUDE_API_KEY" "true"
check_var "CLAUDE_API_KEY" "$CLAUDE_API_KEY" "true"

echo -e "${BLUE}🗄️  Verificando Supabase...${NC}"
check_var "VITE_SUPABASE_URL" "$VITE_SUPABASE_URL" "true"
check_var "VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_ANON_KEY" "true"

echo -e "${BLUE}⚙️  Verificando configuración general...${NC}"
check_var "NODE_ENV" "$NODE_ENV" "false"
check_var "VITE_APP_URL" "$VITE_APP_URL" "false"

echo ""
echo "============================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡CONFIGURACIÓN CORRECTA!${NC}"
    echo -e "${GREEN}Puedes ejecutar: npm run dev${NC}"
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}💡 Primero ejecuta: npm install${NC}"
    fi
    
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(es) encontrado(s)${NC}"
    echo -e "${YELLOW}📖 Consulta: SETUP_VARIABLES_ENTORNO.md${NC}"
    exit 1
fi
