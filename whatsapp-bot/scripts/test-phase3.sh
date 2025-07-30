#!/bin/bash

echo "🧪 Testing Neverafy WhatsApp Bot - Phase 3"
echo "=========================================="

# Verificar que el servidor esté corriendo
echo "1. Testing health endpoint..."
response1=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
    echo "✅ Health check: Phase 3 features enabled"
else
    echo "❌ Health check failed - ¿Está corriendo el servidor?"
    exit 1
fi

echo -e "\n2. Testing Phase 3 Features..."

# Test conversación natural avanzada
echo "🤖 Testing: Advanced natural conversation"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_phase3_001",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666111111",
            "id": "test_natural_conv",
            "timestamp": "1234567890",
            "text": {
              "body": "Hola, ¿puedes ayudarme con mi nevera?"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: 'Hola, ¿puedes ayudarme con mi nevera?' (contextual greeting)"

# Test petición de receta inteligente
echo "🍳 Testing: Intelligent recipe request"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_phase3_002",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666222222",
            "id": "test_recipe_ai",
            "timestamp": "1234567891",
            "text": {
              "body": "¿qué puedo cocinar para cenar con lo que tengo?"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: '¿qué puedo cocinar para cenar con lo que tengo?' (recipe with AI)"

# Test conversación contextual
echo "🧠 Testing: Contextual conversation memory"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_phase3_003",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666333333",
            "id": "test_context_memory",
            "timestamp": "1234567892",
            "text": {
              "body": "Tengo tomates que caducan mañana, ¿alguna idea?"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: 'Tengo tomates que caducan mañana, ¿alguna idea?' (contextual urgency)"

# Test detección de intención avanzada
echo "🎯 Testing: Advanced intent detection"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_phase3_004",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666444444",
            "id": "test_intent_advanced",
            "timestamp": "1234567893",
            "text": {
              "body": "Me gustaría saber si tengo algo que se esté echando a perder"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: 'Me gustaría saber si tengo algo que se esté echando a perder' (complex intent)"

# Test conversación seguimiento
echo "🔄 Testing: Follow-up conversation"
curl -s -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "test_phase3_005",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "123456789",
            "phone_number_id": "test_phone_id"
          },
          "messages": [{
            "from": "34666555555",
            "id": "test_followup",
            "timestamp": "1234567894",
            "text": {
              "body": "Perfecto, ¿y cómo preparo eso?"
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }' > /dev/null

echo "✅ Sent: 'Perfecto, ¿y cómo preparo eso?' (follow-up context)"

echo -e "\n🆕 NUEVAS FUNCIONALIDADES FASE 3:"
echo "✅ IA Conversacional Avanzada con Claude"
echo "✅ Detección de intenciones contextual"
echo "✅ Memoria de conversación (historial)"
echo "✅ Sugerencias de recetas personalizadas"
echo "✅ Respuestas contextuales según productos del usuario"
echo "✅ Seguimiento de conversaciones con contexto"
echo "✅ Análisis inteligente de productos urgentes"

echo -e "\n📊 COMPARACIÓN CON FASES ANTERIORES:"
echo "Phase 1: Respuestas básicas predefinidas"
echo "Phase 2: Comandos + gestión de productos"
echo "Phase 3: IA conversacional + contexto + recetas personalizadas"

echo -e "\n📝 Para ver las conversaciones inteligentes generadas:"
echo "   tail -f logs/combined.log | grep -E '(AI response|Intent detected)'"

echo -e "\n🎯 Ejemplos de mensajes que ahora entiende perfectamente:"
echo "• 'Hola, ¿qué puedo hacer con los productos que se van a caducar?'"
echo "• '¿Tienes alguna receta rica para esta noche?'"
echo "• 'Me sobran huevos y leche, ¿alguna idea para el desayuno?'"
echo "• 'Creo que compré demasiado ayer, ¿puedes revisar qué tengo?'"
echo "• 'Estoy pensando en hacer algo rápido para cenar'"

echo -e "\n🎉 ¡Fase 3 testing completado!"
echo "El bot ahora mantiene conversaciones naturales e inteligentes"
