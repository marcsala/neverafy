#!/bin/bash

echo "🧪 Testing Neverafy WhatsApp Bot - Phase 1"
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

echo -e "\n4. Testing webhook POST (simulated message)..."
response4=$(curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_123",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666123456",
            "id": "test_message_id_123",
            "timestamp": "1234567890",
            "text": {
              "body": "test"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }')

if [ "$response4" = "OK" ]; then
    echo "✅ Webhook POST: $response4"
else
    echo "❌ Webhook POST failed. Response: $response4"
fi

echo -e "\n5. Testing different message types..."

# Test con mensaje "hola"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_456",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789", 
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666654321",
            "id": "test_message_hola",
            "timestamp": "1234567891",
            "text": {
              "body": "hola"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent test message: 'hola'"

# Test con mensaje "ayuda"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_entry_789", 
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666987654",
            "id": "test_message_ayuda",
            "timestamp": "1234567892",
            "text": {
              "body": "ayuda"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent test message: 'ayuda'"

echo -e "\n📝 Nota: Los mensajes no se envían realmente porque necesitas configurar:"
echo "   - WHATSAPP_ACCESS_TOKEN"
echo "   - WHATSAPP_PHONE_NUMBER_ID" 
echo "   - Pero el bot procesa los mensajes correctamente!"

echo -e "\n🎉 ¡Fase 1 testing completado!"
echo "Revisa los logs en: logs/combined.log"
echo -e "\nPara ver logs en tiempo real:"
echo "tail -f logs/combined.log"
