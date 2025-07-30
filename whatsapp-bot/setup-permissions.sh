#!/bin/bash

echo "🔧 Configurando permisos de archivos ejecutables..."

# Hacer ejecutable el script de testing
chmod +x scripts/test-local.sh

echo "✅ Scripts configurados como ejecutables:"
echo "   - scripts/test-local.sh"

echo -e "\n🎯 Ahora puedes ejecutar:"
echo "   ./scripts/test-local.sh"
echo -e "\n🚀 ¡Listo para testing!"
