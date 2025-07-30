# 🚀 Instrucciones para Probar el Bot (Fase 1)

## ✅ **¡Todo Listo!** 

Has implementado exitosamente la **Fase 1** del bot de WhatsApp de Neverafy. Ahora puedes probarlo.

---

## 🎯 **Pasos para Probar el Bot Localmente**

### 1. **Navegar a la Carpeta del Bot**
```bash
cd neverafy/whatsapp-bot
```

### 2. **Instalar Dependencias**
```bash
npm install
```

### 3. **Configurar Permisos de Scripts**
```bash
chmod +x setup-permissions.sh
./setup-permissions.sh
```

### 4. **Ejecutar el Servidor (Terminal 1)**
```bash
npm run dev
```

Deberías ver:
```
🚀 Neverafy WhatsApp Bot started successfully
   port: 3000
   host: localhost
   environment: development
   version: 1.0.0
```

### 5. **Ejecutar Tests (Terminal 2)**
```bash
# En una nueva terminal
./scripts/test-local.sh
```

Deberías ver algo como:
```
🧪 Testing Neverafy WhatsApp Bot - Phase 1
==========================================
1. Testing health endpoint...
✅ Health check: {"status":"ok","timestamp":"2024-07-29T10:15:30.123Z"...}

2. Testing root endpoint...
✅ Root endpoint: {"message":"Neverafy WhatsApp Bot","version":"1.0.0"...}

3. Testing webhook verification...
✅ Webhook verification: Challenge returned correctly

4. Testing webhook POST (simulated message)...
✅ Webhook POST: OK

5. Testing different message types...
✅ Sent test message: 'hola'
✅ Sent test message: 'ayuda'

🎉 ¡Fase 1 testing completado!
```

---

## 📋 **Comandos del Bot Disponibles**

Una vez configurado con WhatsApp Business API real, el bot responderá a:

### 🗣️ **Saludos**
- `hola` → Saludo personalizado
- `buenos días` / `buenas tardes` → Saludos contextuales

### ❓ **Ayuda**
- `ayuda` → Lista completa de comandos
- `info` → Información sobre Neverafy
- `que es neverafy` → Explicación del servicio

### 🔧 **Testing**
- `test` → Verificar funcionamiento
- `ping` → Test de conectividad
- `version` → Información del bot

### 💬 **Conversación**
- `como estas` → Preguntarle al bot
- `gracias` → Respuesta de agradecimiento
- `adios` → Despedida

---

## 🌐 **Configurar WhatsApp Business API (Opcional para Fase 1)**

Si quieres conectar con WhatsApp real:

### 1. **Crear App en Meta for Developers**
1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crear App → Business → WhatsApp Business API
3. Configurar producto WhatsApp

### 2. **Obtener Credenciales**
1. **Access Token**: En WhatsApp → Getting Started
2. **Phone Number ID**: Mismo panel
3. **Verify Token**: Crea uno personalizado (ej: `neverafy_webhook_2024`)

### 3. **Actualizar .env**
```bash
WHATSAPP_ACCESS_TOKEN=tu_access_token_real
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_real
WHATSAPP_WEBHOOK_VERIFY_TOKEN=tu_verify_token_personalizado
```

### 4. **Deploy a Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. **Configurar Webhook en Meta**
- URL: `https://tu-dominio.vercel.app/api/webhook`
- Verify Token: El mismo que pusiste en .env
- Suscribirse a "messages"

---

## 📊 **Ver Logs del Bot**

### En Desarrollo Local:
```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Solo errores
tail -f logs/error.log

# Con npm script
npm run logs
```

### Ejemplo de Log:
```
2024-07-29 12:15:30 [INFO]: Processing message from 34666123456
{
  "message": "hola",
  "messageId": "wamid.abc123",
  "timestamp": "2024-07-29T10:15:30.000Z"
}

2024-07-29 12:15:31 [INFO]: Response sent successfully to 34666123456
```

---

## 🎯 **¿Todo Funciona?**

### ✅ **Si ves esto, ¡perfecto!**
- Servidor ejecutándose en puerto 3000
- Tests pasando correctamente
- Logs generándose en `/logs/`
- Respuestas del webhook = "OK"

### ❌ **Si hay problemas:**

#### Error de dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error de permisos:
```bash
chmod -R 755 .
chmod +x scripts/*.sh
chmod +x *.sh
```

#### Error de puertos:
```bash
# Cambiar puerto en .env
PORT=3001
```

---

## 🚀 **¿Qué Sigue? - Roadmap**

### **Fase 2 (Próxima Semana): Integración Supabase**
- Conectar con base de datos Neverafy existente
- Gestión de usuarios WhatsApp
- Comandos `/productos` y `/stats`
- CRUD básico de productos

### **Fase 3: IA Conversacional**
- Integración con Claude AI
- Procesamiento de lenguaje natural
- Respuestas contextuales inteligentes

### **Fase 4: Sistema de Alertas**
- Alertas automáticas de caducidad
- Cron jobs personalizados
- Notificaciones proactivas

### **Fase 5: Monetización**
- Sistema freemium
- Integración con Bizum
- Features premium

### **Fase 6: Testing y Optimización**
- Suite completa de tests
- Performance optimization
- Preparación para escala

---

## 🎉 **¡Felicitaciones!**

Has construido exitosamente la base de un bot de WhatsApp profesional para Neverafy:

✅ **16 archivos de código** implementados  
✅ **Arquitectura escalable** con TypeScript  
✅ **Sistema de logging** profesional  
✅ **Testing automatizado** funcionando  
✅ **Deploy ready** para Vercel  
✅ **Documentación completa** creada  

**El bot está listo para recibir mensajes y responder de forma inteligente.**

---

## 📞 **Soporte**

Si tienes problemas:
1. Revisa los logs en `logs/combined.log`
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que el puerto 3000 esté libre
4. Consulta el README.md para troubleshooting detallado

**¡Estás listo para continuar con la Fase 2! 🚀**
