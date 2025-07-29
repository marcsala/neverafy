import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 🚀 Optimizaciones de build
    rollupOptions: {
      output: {
        manualChunks: {
          // Dashboard feature como chunk separado
          'dashboard': ['./src/features/dashboard/index.ts'],
          // Otros features
          'features': [
            './src/features/auth/index.ts',
            './src/features/products/index.ts',
            './src/features/recipes/index.ts'
          ],
          // Librerías externas
          'vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    },
    // Tamaño mínimo para hacer chunk separado
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    // 🔥 Hot reload más rápido para features
    watch: {
      include: ['src/features/**/*', 'src/shared/**/*']
    }
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@/features': path.resolve(__dirname, 'src/features'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/store': path.resolve(__dirname, 'src/store'),
      // 🎯 Alias específicos para features principales
      '@/dashboard': path.resolve(__dirname, 'src/features/dashboard'),
      '@/types': path.resolve(__dirname, 'src/types')
    }
  },
  // 🧪 Configuración para testing
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  },
  // ⚡ Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js'
    ],
    exclude: [
      // Excluir si tienes dependencias problemáticas
    ]
  }
})
