# 📧 CONFIGURACIÓN RESEND PARA NEVERAFY

## 1. Crear cuenta en Resend
1. Ve a https://resend.com
2. Sign up con tu email
3. Verifica tu email
4. Ve a "API Keys" → "Create API Key"
5. Copia la key (empieza por `re_`)

## 2. Configurar dominio (OPCIONAL para beta)
- En Resend → "Domains" → "Add Domain"  
- Añade tu dominio (ej: neverafy.com)
- Configura DNS según instrucciones
- Emails vendrán de: alertas@neverafy.com

## 3. Si NO tienes dominio (para beta):
- Emails vendrán de: onboarding@resend.dev
- Funciona perfectamente para testing

## 4. Añadir variables de entorno
```bash
# Añadir a .env.local
RESEND_API_KEY=re_tu_api_key_aqui
VITE_APP_URL=https://tu-app.vercel.app
```

## 5. Límites gratuitos de Resend:
- 3,000 emails/mes gratis
- 100 emails/día gratis
- Perfecto para beta de 50-100 usuarios
