#!/bin/bash

# =================================
# Legacy Code Cleanup Script
# =================================

echo "🗑️ Iniciando limpieza de código legacy..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    log_error "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que el nuevo Dashboard funciona
echo "🔍 Verificando que el Dashboard refactorizado existe..."
if [ ! -f "src/features/dashboard/components/DashboardRefactored.tsx" ]; then
    log_error "El Dashboard refactorizado no existe. No elimines nada."
    exit 1
fi

# Confirmar con el usuario
echo ""
echo "⚠️  ADVERTENCIA: Este script eliminará código legacy permanentemente."
echo "   Solo continúa si has verificado que el Dashboard refactorizado funciona correctamente."
echo ""
read -p "¿Estás seguro de que quieres continuar? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Operación cancelada por el usuario"
    exit 0
fi

# Crear backup final antes de eliminar
echo "📦 Creando backup final..."
BACKUP_DIR="backup_before_cleanup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Lista de archivos legacy a eliminar
LEGACY_FILES=(
    "src/components/Dashboard.tsx"
    "src/components/DashboardView.tsx.backup"
    "src/components/ProductsView.tsx.backup"
    "src/components/RecipesView.tsx.backup"
    "src/components/RecipeModal.tsx.backup"
    "src/components/AnalyticsView.tsx.backup"
    "src/components/AchievementsView.tsx.backup"
    "src/components/CameraView.tsx.backup"
    "src/components/Footer.tsx.backup"
    "src/components/NavBar.tsx.backup"
)

# Backup de archivos que vamos a eliminar
for file in "${LEGACY_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/" 2>/dev/null
        log_success "Backup: $file"
    fi
done

echo ""
echo "🗑️ Eliminando archivos legacy..."

# Eliminar archivos legacy
for file in "${LEGACY_FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        log_success "Eliminado: $file"
    else
        echo "   Saltando: $file (no existe)"
    fi
done

# Eliminar todos los archivos .backup
echo ""
echo "🧹 Eliminando archivos .backup..."
find src -name "*.backup" -type f | while read -r file; do
    cp "$file" "$BACKUP_DIR/" 2>/dev/null
    rm "$file"
    log_success "Eliminado: $file"
done

# Verificar imports en archivos
echo ""
echo "🔍 Verificando imports que pueden necesitar actualización..."

# Buscar archivos que importan el Dashboard legacy
grep -r "from.*components/Dashboard" src/ 2>/dev/null | grep -v backup | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    log_warning "Revisa imports en: $file"
done

grep -r "import.*Dashboard.*from.*components" src/ 2>/dev/null | grep -v backup | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    log_warning "Revisa imports en: $file"
done

echo ""
echo "📋 Resumen de limpieza:"
echo "   📦 Backup creado en: $BACKUP_DIR"
echo "   🗑️ Archivos legacy eliminados"
echo "   🧹 Archivos .backup eliminados"
echo ""

# Verificar que el proyecto aún compila
echo "🔨 Verificando que el proyecto aún compila..."
if npm run build >/dev/null 2>&1; then
    log_success "El proyecto compila correctamente"
else
    log_error "El proyecto no compila. Revisa los imports y dependencias."
    echo "   Puedes restaurar desde: $BACKUP_DIR"
fi

echo ""
echo "✨ Limpieza completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Ejecuta 'npm run dev' para verificar que todo funciona"
echo "   2. Ejecuta 'npm run build' para verificar que compila"
echo "   3. Si hay problemas, restaura desde: $BACKUP_DIR"
echo "   4. Si todo funciona, puedes eliminar los backups antiguos"
echo ""
log_success "¡Código legacy eliminado exitosamente!"
