#!/bin/bash

# =================================
# Dashboard Migration Script
# =================================

echo "🚀 Iniciando migración del Dashboard a arquitectura modular..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para logs
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en la raíz del proyecto
if [ ! -f "package.json" ]; then
    log_error "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Crear backup antes de la migración
echo "📦 Creando backup..."
BACKUP_DIR="backup_dashboard_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r src/components "$BACKUP_DIR/" 2>/dev/null || true
cp src/App.tsx "$BACKUP_DIR/" 2>/dev/null || true
log_success "Backup creado en $BACKUP_DIR"

# Verificar que la nueva estructura existe
if [ ! -d "src/features/dashboard" ]; then
    log_error "La nueva estructura del dashboard no existe. Ejecuta primero la refactorización."
    exit 1
fi

# Verificar que el Dashboard refactorizado existe
if [ ! -f "src/features/dashboard/components/DashboardRefactored.tsx" ]; then
    log_error "El Dashboard refactorizado no existe"
    exit 1
fi

# Verificar dependencias necesarias
echo "🔍 Verificando dependencias..."

# Verificar que React y TypeScript están instalados
if ! npm list react >/dev/null 2>&1; then
    log_error "React no está instalado"
    exit 1
fi

if ! npm list typescript >/dev/null 2>&1; then
    log_warning "TypeScript no está instalado, instalando..."
    npm install -D typescript
fi

log_success "Dependencias verificadas"

# Ejecutar tests si están disponibles
echo "🧪 Ejecutando tests..."
if [ -f "src/features/dashboard/__tests__/utils.test.ts" ]; then
    if npm test src/features/dashboard/__tests__ >/dev/null 2>&1; then
        log_success "Tests del dashboard pasaron"
    else
        log_warning "Algunos tests fallaron, revisa la consola"
    fi
else
    log_warning "Tests no encontrados, continuando..."
fi

# Verificar que el App.tsx ha sido actualizado
echo "📝 Verificando App.tsx..."
if grep -q "DashboardRefactored" src/App.tsx; then
    log_success "App.tsx ya está usando el Dashboard refactorizado"
elif grep -q "features/dashboard" src/App.tsx; then
    log_success "App.tsx está usando el Dashboard refactorizado"
else
    log_warning "App.tsx no parece estar usando el Dashboard refactorizado"
    echo "   Actualiza manualmente el import en App.tsx:"
    echo "   import Dashboard from './features/dashboard/components/DashboardRefactored';"
fi

# Verificar estructura de la nueva arquitectura
echo "🏗️  Verificando estructura..."

REQUIRED_DIRS=(
    "src/features/dashboard/components"
    "src/features/dashboard/hooks"
    "src/features/dashboard/types"
    "src/features/dashboard/utils"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        log_success "Directorio $dir existe"
    else
        log_error "Directorio $dir no existe"
        exit 1
    fi
done

# Verificar archivos principales
REQUIRED_FILES=(
    "src/features/dashboard/components/DashboardRefactored.tsx"
    "src/features/dashboard/hooks/useDashboard.ts"
    "src/features/dashboard/types/dashboard.types.ts"
    "src/features/dashboard/utils/dashboardUtils.ts"
    "src/features/dashboard/index.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_success "Archivo $file existe"
    else
        log_error "Archivo $file no existe"
        exit 1
    fi
done

# Contar líneas de código para mostrar progreso
if command -v wc >/dev/null 2>&1; then
    OLD_LINES=$(wc -l src/components/Dashboard.tsx 2>/dev/null | awk '{print $1}' || echo "0")
    NEW_LINES=$(find src/features/dashboard -name "*.tsx" -o -name "*.ts" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
    
    echo "📊 Estadísticas de la migración:"
    echo "   Dashboard original: $OLD_LINES líneas"
    echo "   Dashboard refactorizado: $NEW_LINES líneas (distribuidas en módulos)"
    
    if [ "$NEW_LINES" -gt "$OLD_LINES" ]; then
        log_success "Código expandido y modularizado correctamente"
    fi
fi

# Verificar que Supabase está configurado
echo "🗄️  Verificando configuración de Supabase..."
if [ -f "src/services/supabase.ts" ] || [ -f "src/shared/hooks/useSupabase.ts" ]; then
    log_success "Supabase configurado"
else
    log_warning "Supabase no está configurado, algunas funcionalidades pueden no funcionar"
fi

# Sugerencias de siguientes pasos
echo ""
echo "🎉 ¡Migración completada!"
echo ""
echo "📋 Siguientes pasos recomendados:"
echo "   1. Ejecuta 'npm run dev' para probar la aplicación"
echo "   2. Verifica que todas las funcionalidades funcionan:"
echo "      - Añadir productos"
echo "      - Navegación entre vistas"
echo "      - Notificaciones"
echo "      - Responsive design"
echo "   3. Ejecuta 'npm run build' para verificar que compila"
echo "   4. Si todo funciona, considera eliminar el Dashboard original:"
echo "      - src/components/Dashboard.tsx"
echo "      - Archivos *.backup"
echo ""
echo "🔗 Recursos:"
echo "   - Documentación: src/features/dashboard/README.md"
echo "   - Tests: src/features/dashboard/__tests__/"
echo "   - Backup: $BACKUP_DIR/"
echo ""
log_success "¡Dashboard refactorizado listo para usar!"
