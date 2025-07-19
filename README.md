# 🥬 Neverafy - Tu nevera, inteligente

**Nunca más desperdicies comida**

Neverafy es una aplicación inteligente que te ayuda a gestionar tu nevera, ahorrar dinero y cuidar el planeta usando tecnología de IA avanzada.

## ✨ Características

- 🧠 **OCR con IA**: Reconoce productos y fechas de vencimiento automáticamente
- 🍳 **Recetas personalizadas**: Genera recetas usando exactamente lo que tienes
- 🔔 **Alertas inteligentes**: Te avisa antes de que los productos venzan
- 📊 **Analytics completos**: Ve cuánto dinero y CO2 has ahorrado
- 🎮 **Gamificación**: Puntos, logros y niveles para motivarte
- 🌍 **Impacto ambiental**: Reduce tu huella de carbono

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ instalado
- Cuenta en Supabase
- API Key de Claude (Anthropic)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/marcsala/neverafy.git
   cd neverafy
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```env
   REACT_APP_SUPABASE_URL=tu_url_de_supabase
   REACT_APP_SUPABASE_ANON_KEY=tu_clave_de_supabase
   CLAUDE_API_KEY=tu_clave_de_claude
   ```

4. **Configura la base de datos en Supabase**
   
   Ejecuta este SQL en tu dashboard de Supabase:
   ```sql
   -- Crear tablas
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

   -- Habilitar RLS
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

   -- Políticas de seguridad
   CREATE POLICY "Users can view own products" ON products
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own products" ON products
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can view own stats" ON user_stats
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can update own stats" ON user_stats
     FOR ALL USING (auth.uid() = user_id);
   ```

5. **Ejecuta en desarrollo**
   ```bash
   npm run dev
   ```

6. **Construye para producción**
   ```bash
   npm run build
   ```

## 🚀 Deploy en Vercel

### Opción 1: Deploy Automático

1. **Conecta tu repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Importa el repositorio `neverafy`

2. **Configura las variables de entorno en Vercel**
   - Ve a Settings → Environment Variables
   - Añade las siguientes variables:
     ```
     REACT_APP_SUPABASE_URL=tu_url_de_supabase
     REACT_APP_SUPABASE_ANON_KEY=tu_clave_de_supabase
     CLAUDE_API_KEY=tu_clave_de_claude
     ```

3. **Deploy automático**
   - Vercel detectará automáticamente que es un proyecto Vite/React
   - El deploy se ejecutará automáticamente

### Opción 2: Deploy desde CLI

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configura las variables de entorno
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
vercel env add CLAUDE_API_KEY

# Redeploy con las nuevas variables
vercel --prod
```

## 📁 Estructura del Proyecto

```
neverafy/
├── api/                    # Vercel Functions
│   └── claude.js          # Proxy para Claude API
├── public/                 # Assets estáticos
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/         # Componentes React
│   │   ├── DashboardView.tsx
│   │   ├── CameraView.tsx
│   │   └── ...
│   ├── services/          # Servicios externos
│   │   ├── supabase.ts
│   │   └── claudeApi.ts
│   ├── store/             # Estado global (Zustand)
│   ├── App.tsx
│   └── main.tsx
├── .env.example           # Variables de entorno de ejemplo
├── .env.local            # Variables de entorno locales (no commitear)
├── package.json
├── vercel.json           # Configuración de Vercel
└── vite.config.ts        # Configuración de Vite
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Estado**: Zustand
- **Backend**: Supabase (BaaS)
- **IA**: Claude API (Anthropic)
- **Deploy**: Vercel
- **Build**: Vite + esbuild

## 🎯 Funcionalidades Principales

### 📸 OCR Inteligente
- Reconoce productos y fechas automáticamente
- Soporte para múltiples formatos de fecha
- Estimación de precios
- Confianza del reconocimiento

### 🍳 Recetas con IA
- Genera recetas personalizadas
- Usa ingredientes que vencen pronto
- Recetas adaptadas a ingredientes españoles
- Diferentes niveles de dificultad

### 📊 Analytics y Gamificación
- Seguimiento de ahorros económicos
- Cálculo de impacto ambiental (CO2)
- Sistema de puntos y logros
- Rachas de consumo responsable

### 🔔 Alertas Inteligentes
- Notificaciones antes del vencimiento
- Configuración de horarios
- Diferentes tipos de alertas

## 🚨 Troubleshooting

### Error: Claude API no funciona
- Verifica que `CLAUDE_API_KEY` esté configurada correctamente
- Asegúrate de que la API key sea válida y tenga créditos
- Revisa los logs en Vercel Functions

### Error: Supabase connection failed
- Verifica las URLs y keys de Supabase
- Asegúrate de que las tablas estén creadas
- Revisa las políticas RLS

### Error: Build failed en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no hay errores TypeScript
- Revisa los logs de build en Vercel

## 📋 TODO / Roadmap

- [ ] **Autenticación social** (Google, Apple)
- [ ] **Notificaciones push** reales
- [ ] **PWA** con funcionalidad offline
- [ ] **Sistema de pagos** (Stripe)
- [ ] **Integración con supermercados** (precios reales)
- [ ] **API de nutrición** (información nutricional)
- [ ] **Modo familiar** (neveras compartidas)
- [ ] **Exportar datos** (CSV, PDF)
- [ ] **Tests unitarios** (Jest + React Testing Library)
- [ ] **Internacionalización** (i18n)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Marc Sala**
- GitHub: [@marcsala](https://github.com/marcsala)
- Email: hola@neverafy.com

## 🙏 Agradecimientos

- [Anthropic](https://anthropic.com) por la API de Claude
- [Supabase](https://supabase.com) por el backend como servicio
- [Vercel](https://vercel.com) por el hosting y deploy
- [Lucide](https://lucide.dev) por los iconos

---

**¿Te gusta Neverafy?** ⭐ Dale una estrella al repo y compártelo con tus amigos!

**¿Problemas o sugerencias?** 🐛 Abre un [issue](https://github.com/marcsala/neverafy/issues)
