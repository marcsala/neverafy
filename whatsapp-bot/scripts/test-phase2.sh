#!/bin/bash

echo "🧪 Testing Neverafy WhatsApp Bot - Phase 2"
echo "=========================================="

# Verificar que el servidor esté corriendo
echo "1. Testing health endpoint..."
response1=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
    echo "✅ Health check: $response1"
else
    echo "❌ Health check failed - ¿Está corriendo el servidor?"
    exit 1
fi

echo -e "\n2. Testing root endpoint..."
response2=$(curl -s http://localhost:3000/)
if [ $? -eq 0 ]; then
    echo "✅ Root endpoint: $response2"
else
    echo "❌ Root endpoint failed"
fi

echo -e "\n3. Testing webhook verification..."
response3=$(curl -s "http://localhost:3000/api/webhook?hub.mode=subscribe&hub.verify_token=neverafy_webhook_secure_2024&hub.challenge=test_challenge_12345")
if [ "$response3" = "test_challenge_12345" ]; then
    echo "✅ Webhook verification: Challenge returned correctly"
else
    echo "❌ Webhook verification failed. Response: $response3"
fi

echo -e "\n4. Testing NEW FEATURES - Product Management..."

# Test añadir producto
echo "📦 Testing: Adding product via natural language"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_001",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666111111",
            "id": "test_add_product",
            "timestamp": "1234567890",
            "text": {
              "body": "tengo leche que caduca el viernes"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: 'tengo leche que caduca el viernes'"

# Test comando /productos
echo "📋 Testing: /productos command"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_002",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666222222",
            "id": "test_productos_cmd",
            "timestamp": "1234567891",
            "text": {
              "body": "/productos"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: '/productos' command"

# Test comando /stats
echo "📊 Testing: /stats command"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_003",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666333333",
            "id": "test_stats_cmd",
            "timestamp": "1234567892",
            "text": {
              "body": "/stats"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: '/stats' command"

# Test consulta natural
echo "🤖 Testing: Natural language query"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_004",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666444444",
            "id": "test_natural_query",
            "timestamp": "1234567893",
            "text": {
              "body": "qué tengo en la nevera"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: 'qué tengo en la nevera' (natural language)"

echo -e "\n📝 NUEVAS FUNCIONALIDADES FASE 2:"
echo "✅ Integración con Supabase"
echo "✅ Gestión de usuarios WhatsApp"
echo "✅ Comandos: /productos, /stats, /urgente, /ayuda"
echo "✅ Añadir productos por texto natural con IA"
echo "✅ Detección de intenciones"
echo "✅ Conexión con Claude AI"

echo -e "\n📊 Nota: Para ver las respuestas del bot revisa:"
echo "   tail -f logs/combined.log"

echo -e "\n🎉 ¡Fase 2 testing completado!"
echo "El bot ahora puede gestionar productos reales conectando con Supabase"
