# ⚡ SETUP RÁPIDO DE NEVERAFY

## 🚀 PASO 1: Configurar Variables de Entorno

### 1.1 Crear archivo de configuración
```bash
cp .env.example .env.local
```

### 1.2 Obtener Claude API Key
1. Ve a https://console.anthropic.com/
2. Crea cuenta → "API Keys" → "Create Key"
3. Copia la key (empieza por `sk-ant-api03-...`)

### 1.3 Obtener Supabase credentials
1. Ve a https://supabase.com/dashboard
2. "New Project" → Elige nombre y región Europa
3. Ve a Settings → API
4. Copia "Project URL" y "anon public key"

### 1.4 Editar .env.local
```bash
# Reemplazar estos valores:
VITE_CLAUDE_API_KEY=sk-ant-api03-TU_CLAVE_AQUI
CLAUDE_API_KEY=sk-ant-api03-LA_MISMA_CLAVE
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co  
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...TU_KEY
```

## 🗄️ PASO 2: Configurar Base de Datos

### 2.1 Crear tablas en Supabase
1. Ve a tu dashboard Supabase → "SQL Editor"
2. Pega y ejecuta este SQL:

```sql
-- Tabla de productos
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

-- Tabla de estadísticas
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

-- Habilitar seguridad
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para products
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_stats  
CREATE POLICY "Users can manage own stats" ON user_stats FOR ALL USING (auth.uid() = user_id);
```

## ✅ PASO 3: Instalar y Probar

### 3.1 Instalar dependencias
```bash
npm install
```

### 3.2 Verificar configuración
```bash
npm run verify-config
```

### 3.3 Ejecutar en desarrollo
```bash
npm run dev
```

### 3.4 Probar funcionalidades
- [ ] Registrarse con email
- [ ] Añadir producto manualmente
- [ ] Ver que se guarda (recargar página)
- [ ] Marcar producto como consumido

## 🚀 PASO 4: Deploy a Producción (Vercel)

### 4.1 Conectar repositorio
1. Ve a https://vercel.com
2. "Import Project" → Conecta tu repo GitHub
3. Vercel detecta automáticamente Vite

### 4.2 Configurar variables en Vercel
Settings → Environment Variables → Añadir:
```
VITE_CLAUDE_API_KEY=sk-ant-api03-...
CLAUDE_API_KEY=sk-ant-api03-...
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=https://tu-app.vercel.app
```

### 4.3 Deploy
```bash
# Verificar que build funciona localmente
npm run deploy-check

# Si todo está bien, Vercel hará auto-deploy al hacer push
git add .
git commit -m "Ready for production"
git push origin main
```

## 🛠️ Scripts Disponibles

```bash
npm run setup          # Instalar + verificar config
npm run start          # Verificar + ejecutar dev
npm run verify-config  # Solo verificar configuración
npm run deploy-check   # Verificar + build para producción
```

## ❌ Solución de Problemas

### "Supabase connection failed"
- Verificar URL y anon key en .env.local
- Verificar que las tablas existen
- Verificar políticas RLS

### "Claude API not configured"  
- Verificar que CLAUDE_API_KEY esté en .env.local
- Verificar que la key sea válida (empiece por sk-ant-api03-)
- Verificar que tienes créditos en tu cuenta Anthropic

### "Module not found"
- Ejecutar `npm install`
- Verificar que Node.js versión 18+

### Build fails en Vercel
- Ejecutar `npm run deploy-check` localmente
- Verificar que todas las env vars están en Vercel
- Revisar logs de build en Vercel dashboard

## 🎉 ¡Listo!

Si todo funciona localmente → **¡Ya puedes lanzar tu beta!**

**Próximos pasos sugeridos:**
1. Invita a 5-10 amigos a probar
2. Recoger feedback directo (WhatsApp/llamadas)
3. Iterar basándote en uso real
4. Cuando tengas tracción → añadir más features

**¡Tu MVP está listo, Marc! Es hora de lanzar.** 🚀
