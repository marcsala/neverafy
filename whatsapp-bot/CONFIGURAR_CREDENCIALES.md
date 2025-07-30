# 🔐 INSTRUCCIONES: Configurar Credenciales WhatsApp

## 📋 **Lo que necesitas obtener de Meta:**

### 1. **Access Token Temporal** 
En Meta for Developers → Tu App → WhatsApp → Getting Started:
- Copia el "Temporary access token" (empieza con EAA...)
- Ejemplo: `EAABsBCS1iHgBO7ZA8wNk3m2x4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1`

### 2. **Phone Number ID**
En la misma página, sección "From":
- Copia el Phone Number ID (solo números)
- Ejemplo: `109876543210987`

### 3. **Webhook Verify Token** 
TÚ lo inventas (cualquier string seguro):
- Ejemplo: `neverafy_webhook_secure_2024_xyz123`

---

## ✏️ **PASO A PASO: Actualizar .env**

1. **Abre el archivo .env en tu editor:**
```bash
nano .env
# o
code .env
# o
vim .env
```

2. **Reemplaza estas 3 líneas con tus credenciales reales:**

```bash
# Reemplaza ESTA línea:
WHATSAPP_ACCESS_TOKEN=EAABsBCS1iHgBO1234567890abcdef
# Por TU Access Token real:
WHATSAPP_ACCESS_TOKEN=EAABsBCS1iHgBO7ZA8wNk3m2x4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1

# Reemplaza ESTA línea:
WHATSAPP_PHONE_NUMBER_ID=1234567890123456
# Por TU Phone Number ID real:
WHATSAPP_PHONE_NUMBER_ID=109876543210987

# Reemplaza ESTA línea:
WHATSAPP_WEBHOOK_VERIFY_TOKEN=neverafy_webhook_token_2024
# Por TU token personalizado:
WHATSAPP_WEBHOOK_VERIFY_TOKEN=neverafy_webhook_secure_2024_xyz123
```

3. **Guarda el archivo** (Ctrl+S)

---

## 🌐 **PASO 5: Configurar Webhook en Meta**

### Una vez tengas las credenciales:

1. **Deploy temporal a Vercel:**
```bash
vercel --prod
```

2. **Copia la URL** que te da Vercel (ej: `https://neverafy-bot-abc123.vercel.app`)

3. **En Meta for Developers:**
   - Ve a WhatsApp → Configuration
   - **Webhook URL**: `https://tu-url-vercel.vercel.app/api/webhook`
   - **Verify token**: El mismo que pusiste en .env
   - Click **"Verify and save"**

4. **Suscribirse a mensajes:**
   - En la misma página, section "Webhooks"
   - Subscribe to: **"messages"** ✅

---

## 🧪 **VERIFICAR QUE FUNCIONA**

### 1. **Test local primero:**
```bash
# Reiniciar servidor con nuevas credenciales
npm run dev

# En otra terminal, test actualizado:
./scripts/test-local.sh
```

### 2. **Test con WhatsApp real:**
- Ve a Meta for Developers → WhatsApp → Getting Started
- En "To", añade tu número de teléfono como tester
- Envía un mensaje de prueba desde la interfaz web
- ¡Deberías recibir respuesta en tu WhatsApp!

---

## ⚠️ **IMPORTANTE: Token Temporal**

El "Temporary access token" **expira en 24 horas**. Para uso real necesitas:

### **Access Token Permanente:**
1. **Crear System User** en Business Manager
2. **Generar token permanente** 
3. **Asignar permisos** de WhatsApp

### **Pero para testing de Fase 1:**
✅ **El token temporal es suficiente** (24 horas)

---

## 🎯 **¿Tienes las credenciales?**

Una vez tengas:
- ✅ Access Token (EAA...)
- ✅ Phone Number ID (números)  
- ✅ Verify Token (tu string personalizado)

**Dime y te ayudo a configurarlas en el .env!** 🚀
