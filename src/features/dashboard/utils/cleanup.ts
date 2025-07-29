// =================================
// Legacy Components Cleanup Guide
// =================================

/*
🗑️ ARCHIVOS QUE SE PUEDEN ELIMINAR DESPUÉS DE LA MIGRACIÓN:

1. COMPONENTE MONOLÍTICO ORIGINAL:
   - /src/components/Dashboard.tsx (500+ líneas) ❌
   
2. COMPONENTES DUPLICADOS:
   - Cualquier componente que haya sido refactorizado en /features/dashboard/components/
   
3. HOOKS OBSOLETOS:
   - Hooks del dashboard que hayan sido reemplazados por los nuevos hooks especializados

4. ARCHIVOS BACKUP:
   - /src/components/*.backup
   - Cualquier archivo con extensión .backup

🔧 PASOS PARA LA LIMPIEZA:

1. Verificar que el Dashboard refactorizado funciona correctamente
2. Ejecutar tests para asegurar que no hay regresiones
3. Hacer backup del código actual
4. Eliminar archivos obsoletos uno por uno
5. Actualizar imports en archivos que referencien componentes eliminados

🚨 ADVERTENCIA:
No eliminar nada hasta estar 100% seguro de que la nueva implementación funciona.

📋 CHECKLIST PRE-ELIMINACIÓN:
□ Dashboard refactorizado funciona en desarrollo
□ Todos los tests pasan
□ Funcionalidades principales verificadas:
  □ Añadir productos
  □ Ver productos
  □ Navegación entre vistas
  □ Notificaciones
  □ Responsive design
  □ Integración con Supabase

COMANDOS SUGERIDOS (ejecutar desde la raíz del proyecto):

# Hacer backup primero
mkdir backup_$(date +%Y%m%d)
cp -r src/components backup_$(date +%Y%m%d)/

# Eliminar archivos backup
find src -name "*.backup" -delete

# Eliminar el Dashboard original (SOLO después de verificar)
# rm src/components/Dashboard.tsx

*/

export const CLEANUP_CHECKLIST = [
  "Dashboard refactorizado funciona correctamente",
  "Todos los tests pasan",
  "Navegación entre vistas funciona",
  "Modal de añadir producto funciona", 
  "Sistema de notificaciones funciona",
  "Responsive design verificado",
  "Integración con Supabase funciona",
  "No hay errores en consola",
  "Performance es aceptable"
];

export const FILES_TO_REMOVE_LATER = [
  "src/components/Dashboard.tsx", // Componente monolítico original
  "src/components/*.backup", // Archivos backup
  // Añadir más archivos según sea necesario
];

export const MIGRATION_STATUS = {
  phase1: "✅ Completada - Estructura y tipos",
  phase2: "✅ Completada - Micro-componentes",
  phase3: "✅ Completada - Hooks especializados", 
  phase4: "🔄 En progreso - Integración y optimización",
  phase5: "⏳ Pendiente - Cleanup y documentación"
};
