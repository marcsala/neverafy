# 🤖 Neverafy WhatsApp Bot

Bot de WhatsApp para la gestión inteligente de nevera integrado con la plataforma Neverafy.

## 📋 Estado Actual: Fase 1 Completada ✅

### ✅ Funcionalidades Implementadas (Fase 1)
- **Webhook de WhatsApp** configurado y funcionando
- **Respuestas automáticas** a mensajes básicos
- **Sistema de logging** completo con Winston
- **Validación de configuración** y manejo de errores
- **Deploy listo para Vercel**

### 🔧 Próximas Fases
- **Fase 2**: Integración con Supabase + gestión de productos
- **Fase 3**: IA conversacional con Claude
- **Fase 4**: Sistema de alertas automáticas  
- **Fase 5**: Monetización con Bizum
- **Fase 6**: Testing y optimización

---

## 🚀 Setup Rápido

### 1. Instalar Dependencias
```bash
cd whatsapp-bot
npm install
```

### 2. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de WhatsApp Business API
```

### 3. Obtener Credenciales WhatsApp Business API

#### Paso 1: Crear App en Meta for Developers
1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crear nueva App → Business → WhatsApp Business API
3. Añadir producto "WhatsApp" a tu app

#### Paso 2: Configurar WhatsApp Business API
1. En el dashboard de tu app, ve a WhatsApp → Getting Started
2. Copia el **Access Token** temporal (después configura uno permanente)
3. Copia el **Phone Number ID** 
4. Crea un **Verify Token** personalizado (cualquier string seguro)

#### Paso 3: Configurar .env
```bash
WHATSAPP_ACCESS_TOKEN=tu_access_token_de_meta
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_de_meta  
WHATSAPP_WEBHOOK_VERIFY_TOKEN=tu_token_personalizado_123456
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

---

## 🧪 Testing

### Test Local Completo
```bash
# En una terminal - ejecutar el servidor
npm run dev

# En otra terminal - ejecutar tests
chmod +x scripts/test-local.sh
./scripts/test-local.sh
```

### Test Manual de Endpoints

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Verificación Webhook
```bash
curl "http://localhost:3000/api/webhook?hub.mode=subscribe&hub.verify_token=tu_token_personalizado_123456&hub.challenge=test123"
```

#### Simular Mensaje de WhatsApp
```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666123456",
            "id": "test_message_id",
            "timestamp": "1234567890",
            "text": {
              "body": "hola"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }'
```

---

## 🚀 Deploy a Producción

### Deploy a Vercel
```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno en Vercel dashboard
```

### Configurar Webhook en Meta
1. Ve a tu app en Meta for Developers
2. WhatsApp → Configuration
3. Webhook URL: `https://tu-dominio.vercel.app/api/webhook`
4. Verify Token: el mismo que pusiste en .env
5. Suscribirse a "messages" 

---

## 📱 Comandos del Bot (Fase 1)

El bot actualmente responde a estos mensajes:

### 🗣️ Saludos
- `hola` - Saludo inicial
- `buenos días` / `buenas tardes` / `buenas noches`

### ❓ Ayuda e Información  
- `ayuda` / `help` - Lista de comandos
- `info` - Información sobre Neverafy
- `que es neverafy` - Explicación del servicio

### 🔧 Testing y Debug
- `test` - Verificar que el bot funciona
- `ping` - Test de conectividad  
- `version` - Ver versión del bot

### 💬 Conversación
- `como estas` / `que tal` - Preguntarle al bot
- `gracias` - Agradecer
- `adios` / `chao` / `hasta luego` - Despedirse

---

## 📊 Logs y Monitoring

### Ver Logs en Tiempo Real
```bash
# Logs completos
tail -f logs/combined.log

# Solo errores
tail -f logs/error.log

# Con npm script
npm run logs
```

### Estructura de Logs
```
2024-01-15 10:30:45 [INFO]: Message received from 34666123456
{
  "message": "hola",
  "messageId": "wamid.abc123",
  "timestamp": "2024-01-15T09:30:45.000Z"
}
```

---

## 🏗️ Arquitectura

### Estructura del Proyecto
```
whatsapp-bot/
├── src/
│   ├── config/
│   │   └── whatsapp.ts          # Configuración WhatsApp API
│   ├── services/
│   │   └── whatsapp.service.ts  # Servicio de mensajería
│   ├── handlers/
│   │   └── message.handler.ts   # Procesamiento de mensajes
│   ├── utils/
│   │   └── logger.ts            # Sistema de logging
│   ├── types/
│   │   └── whatsapp.types.ts    # Tipos TypeScript
│   ├── api/
│   │   └── webhook.ts           # Webhook principal
│   └── server.ts                # Servidor Fastify
├── scripts/
│   └── test-local.sh           # Script de testing
├── logs/                       # Archivos de log
├── package.json
├── tsconfig.json
├── vercel.json                 # Configuración deploy
└── README.md
```

### Flow de Procesamiento
1. **WhatsApp** envía mensaje al webhook
2. **Webhook** valida y procesa la estructura
3. **MessageHandler** determina la respuesta
4. **WhatsAppService** envía respuesta de vuelta
5. **Logger** registra toda la actividad

---

## 🔧 Troubleshooting

### Problemas Comunes

#### "Configuration validation failed"
- Verifica que todas las variables en `.env` estén configuradas
- El Access Token debe ser válido y no haber expirado
- El Phone Number ID debe corresponder a tu número de WhatsApp Business

#### "Webhook verification failed" 
- El Verify Token en `.env` debe coincidir exactamente con el configurado en Meta
- Verifica que la URL del webhook sea correcta
- Asegúrate de que el servidor esté ejecutándose

#### "WhatsApp API error"
- Verifica que el Access Token tenga los permisos necesarios
- El número de destino debe estar registrado como tester en Meta
- Revisa los logs de error para más detalles

#### Logs no se generan
- Verifica que la carpeta `logs/` exista
- Permisos de escritura en la carpeta del proyecto
- Variable LOG_LEVEL configurada correctamente

### Debug Mode
```bash
# Ejecutar con logs detallados
LOG_LEVEL=debug npm run dev
```

---

## 🎯 Testing de Producción

### Una vez desplegado en Vercel

1. **Verificar Health Check**
```bash
curl https://tu-bot.vercel.app/health
```

2. **Configurar número de prueba en Meta**
   - Ve a WhatsApp → API Setup
   - Añade tu número de teléfono como tester
   - Envía mensaje desde WhatsApp

3. **Monitorear logs en Vercel**
   - Dashboard de Vercel → Functions → View logs

---

## 🛠️ Desarrollo

### Añadir Nueva Respuesta
1. Edita `src/handlers/message.handler.ts`
2. Añade nueva entrada en el objeto `responses`
3. Reinicia el servidor
4. Testea con el script local

### Estructura de una Respuesta
```typescript
'tu_comando': `🎯 *Título de la respuesta*

Descripción o instrucciones.
• Lista de elementos
• Más elementos

¿Pregunta al usuario?`
```

---

## 📈 Próximos Pasos (Fases 2-6)

### Fase 2: Integración Supabase (Semana 2)
- [ ] Conectar con base de datos Neverafy existente
- [ ] Gestión de usuarios WhatsApp
- [ ] CRUD básico de productos
- [ ] Comandos: `/productos`, `/stats`

### Fase 3: IA Conversacional (Semana 3)  
- [ ] Integración con Claude AI
- [ ] Procesamiento de lenguaje natural
- [ ] Respuestas contextuales inteligentes
- [ ] Parsing de productos por texto

### Fase 4: Sistema de Alertas (Semana 4)
- [ ] Cron jobs para alertas automáticas
- [ ] Alertas personalizadas por usuario
- [ ] Notificaciones de productos urgentes
- [ ] Reportes semanales

### Fase 5: Monetización (Semana 5)
- [ ] Sistema de límites free vs premium
- [ ] Integración con Bizum
- [ ] Features premium exclusivas
- [ ] Analytics avanzados

### Fase 6: Testing y Optimización (Semana 6)
- [ ] Suite completa de tests
- [ ] Performance testing
- [ ] Monitoring avanzado
- [ ] Preparación para escala

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crear branch para feature: `git checkout -b feature/nueva-funcionalidad`  
3. Commit cambios: `git commit -am 'Añadir nueva funcionalidad'`
4. Push a branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 📝 Licencia

MIT License - ver `LICENSE` file para detalles.

---

## 📞 Soporte

- **Issues**: GitHub Issues
- **Email**: desarrollo@neverafy.com
- **Documentación**: [docs.neverafy.com](https://docs.neverafy.com)

---

**🎉 ¡Fase 1 completada con éxito! El bot está listo para recibir sus primeros mensajes.**
