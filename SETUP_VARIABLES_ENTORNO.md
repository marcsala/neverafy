# 🚀 GUÍA DE CONFIGURACIÓN DE VARIABLES DE ENTORNO

## ✅ VARIABLES REQUERIDAS PARA LANZAR

### 1. 🤖 Claude API (Anthropic)
**¿Qué hace?** OCR para escanear productos + Generación de recetas IA
**¿Dónde conseguirla?**
1. Ve a https://console.anthropic.com/
2. Crea una cuenta / inicia sesión
3. Ve a "API Keys" 
4. Crea una nueva key
5. Copia la key que empiece por `sk-ant-api03-...`

**Precio:** ~$0.25 por 1000 requests (muy barato para beta)

### 2. 🗄️ Supabase (Base de datos)
**¿Qué hace?** Almacena usuarios, productos, estadísticas
**¿Dónde conseguirla?**
1. Ve a https://supabase.com/dashboard
2. Crea proyecto nuevo → "New Project"
3. Elige región (Europa por GDPR)
4. En Settings → API:
   - Copia "Project URL" → `VITE_SUPABASE_URL`
   - Copia "anon public" key → `VITE_SUPABASE_ANON_KEY`

**Precio:** Gratis hasta 50MB DB + 50,000 requests/mes

## 📋 SETUP PASO A PASO

### 1. Crear archivo .env.local
```bash
cp .env.example .env.local
```

### 2. Configurar Claude API
```bash
# En .env.local, reemplazar:
VITE_CLAUDE_API_KEY=tu_clave_real_aqui
CLAUDE_API_KEY=la_misma_clave_aqui
```

### 3. Configurar Supabase
```bash
# En .env.local, reemplazar:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...tu_key...
```

### 4. Configurar Base de Datos en Supabase
1. Ve al "SQL Editor" en tu dashboard Supabase
2. Ejecuta este script:

```sql
-- Crear tabla de productos
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  expiry_date date NOT NULL,
  quantity integer DEFAULT 1,
  price decimal(10,2),
  source text DEFAULT 'manual',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Crear tabla de estadísticas de usuario
CREATE TABLE user_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_saved decimal(10,2) DEFAULT 0,
  co2_saved decimal(10,2) DEFAULT 0,
  points integer DEFAULT 0,
  streak integer DEFAULT 0,
  level integer DEFAULT 1,
  ocr_used integer DEFAULT 0,
  recipes_generated integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para products
CREATE POLICY "Users can view own products" ON products
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para user_stats  
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Probar configuración
```bash
npm install
npm run dev
```

Si todo funciona → ¡Ya puedes registrarte y probar la app!

## 🔍 VERIFICAR QUE TODO FUNCIONA

### ✅ Checklist de funcionamiento:
- [ ] La app se carga sin errores en consola
- [ ] Puedes registrarte con email
- [ ] Puedes añadir un producto manualmente
- [ ] Se guarda en la base de datos (aparece al recargar)
- [ ] Puedes "consumir" un producto 
- [ ] El OCR intenta procesar imágenes (aunque dé error al principio está bien)

### ❌ Errores comunes:
- **"Supabase URL invalid"** → Revisar formato URL en .env.local
- **"Claude API not configured"** → Revisar que CLAUDE_API_KEY esté en .env.local
- **"Authentication failed"** → Revisar políticas RLS en Supabase
- **"CORS error"** → Está bien, es normal en development

## 🚀 PARA DEPLOYMENT (Vercel)

### Variables en Vercel:
```bash
# Ir a vercel.com → Tu proyecto → Settings → Environment Variables
# Añadir estas variables:

VITE_CLAUDE_API_KEY=sk-ant-api03-...
CLAUDE_API_KEY=sk-ant-api03-...
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=https://tu-app.vercel.app
```

### ⚠️ IMPORTANTE PARA SEGURIDAD:
- NUNCA commitees .env.local al git
- Las variables `VITE_*` son públicas (van al frontend)
- Las variables sin `VITE_` son privadas (solo backend)
- Claude API key debe estar en ambas (pública y privada)

## 💰 COSTOS ESTIMADOS (Beta con 100 usuarios):

- **Supabase:** Gratis (hasta 50MB)
- **Claude API:** ~$5-10/mes (OCR ocasional)
- **Vercel:** Gratis (hasta 100GB bandwidth)
- **Total:** ~$5-10/mes para beta

## 📞 SI ALGO NO FUNCIONA:

1. Revisar consola del navegador (F12)
2. Revisar logs de Vercel (si está deployed)
3. Revisar logs de Supabase (Database → Logs)
4. Contactar si sigues con problemas

**¡Con esto deberías tener todo funcionando!** 🎉
