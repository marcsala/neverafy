#!/bin/bash

echo "🗄️ Configurando Base de Datos - Fase 2"
echo "======================================="

echo ""
echo "📋 INSTRUCCIONES:"
echo "1. Ve a https://supabase.com"
echo "2. Entra a tu proyecto: tbactydpgltluljssvym.supabase.co"
echo "3. Ve a SQL Editor"
echo "4. Copia y pega el contenido de sql/create_tables.sql"
echo "5. Ejecuta las consultas"
echo ""
echo "📄 Archivo SQL ubicado en:"
echo "   $(pwd)/sql/create_tables.sql"
echo ""
echo "🔍 Vista previa del SQL:"
echo "========================"
head -20 sql/create_tables.sql
echo "..."
echo ""
echo "⚠️  IMPORTANTE: Ejecutar TODO el contenido del archivo SQL"
echo "✅ Una vez ejecutado, continúa con: npm run dev"
