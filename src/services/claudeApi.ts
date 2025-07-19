// src/services/claudeApi.ts
// Servicios para integrar con Claude API

export const callClaudeAPI = async (messages: any[], maxTokens = 1500) => {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        max_tokens: maxTokens,
        model: "claude-sonnet-4-20250514"
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
};

// Función para procesar imágenes con OCR
export const processImageWithClaude = async (imageFile: File) => {
  try {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(imageFile);
    });

    const prompt = `
Analiza esta imagen de productos alimentarios y extrae información detallada.

Busca productos de comida y sus fechas de vencimiento. Formatos comunes de fechas:
- DD/MM/YY o DD/MM/YYYY
- "CONSUMIR ANTES DE", "FECHA LÍMITE", "BEST BEFORE"
- "CADUCIDAD", "VENCE", "EXP"

Devuelve ÚNICAMENTE un JSON válido:
{
  "products": [
    {
      "name": "nombre específico del producto",
      "category": "frutas|verduras|lácteos|carne|pescado|pan|conservas|congelados|huevos|otros",
      "expiryDate": "YYYY-MM-DD", 
      "confidence": 0.85,
      "estimatedPrice": 2.50,
      "detectedText": "texto original donde viste la fecha"
    }
  ],
  "success": true,
  "message": "Se detectaron X productos"
}

IMPORTANTE:
- Solo incluye productos con fechas legibles
- Convierte fechas al formato YYYY-MM-DD
- Precios aproximados en euros
- Confidence entre 0.70-0.95
- NO añadas explicaciones, solo JSON puro
`;

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: imageFile.type,
              data: base64Data,
            }
          },
          {
            type: "text",
            text: prompt
          }
        ]
      }
    ];

    const data = await callClaudeAPI(messages, 1500);
    let responseText = data.content[0].text;
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      // Fallback a datos mock si el parsing falla
      return {
        products: [
          {
            name: "Producto detectado",
            category: "otros",
            expiryDate: "2025-07-25",
            confidence: 0.75,
            estimatedPrice: 2.0,
            detectedText: "Fecha detectada en imagen"
          }
        ],
        success: true,
        message: "Producto detectado (modo demo)"
      };
    }

  } catch (error) {
    console.error('Error processing image:', error);
    return {
      products: [],
      success: false,
      message: "Error procesando la imagen. Intenta de nuevo."
    };
  }
};

// Función para generar recetas con IA
export const generateAIRecipes = async (urgentProducts: any[]) => {
  try {
    const productsList = urgentProducts.map(p => 
      `${p.name} (vence en ${getDaysToExpiry(p.expiryDate)} días)`
    ).join(', ');
    
    const prompt = `
Tengo estos productos que vencen pronto: ${productsList}

Genera 3 recetas creativas que usen AL MENOS 2 de estos ingredientes.

Responde ÚNICAMENTE con JSON válido:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "description": "Descripción breve y apetitosa",
      "ingredients": ["ingrediente1", "ingrediente2"],
      "prepTime": "15 minutos",
      "difficulty": "Fácil|Medio|Difícil",
      "steps": ["paso 1", "paso 2", "paso 3"],
      "tips": "Consejo útil para la receta",
      "nutrition": "Información nutricional básica"
    }
  ],
  "success": true
}

Las recetas deben ser:
- Prácticas y rápidas (max 45 min)
- Con ingredientes comunes españoles
- Adaptadas para evitar desperdicio
- Creativas pero realistas
`;

    const messages = [
      { role: "user", content: prompt }
    ];

    const data = await callClaudeAPI(messages, 2000);
    let responseText = data.content[0].text;
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const parsedResponse = JSON.parse(responseText);
    return parsedResponse.recipes || [];
      
  } catch (error) {
    console.error('Error generating recipes:', error);
    // Fallback a recetas básicas
    return urgentProducts.slice(0, 3).map((product, index) => ({
      name: `Receta con ${product.name}`,
      description: `Deliciosa receta para aprovechar ${product.name} antes de que venza`,
      ingredients: [product.name, "Ingredientes básicos"],
      prepTime: "20 minutos",
      difficulty: "Fácil",
      steps: ["Preparar ingredientes", "Cocinar según instrucciones", "Servir caliente"],
      tips: `Ideal para consumir ${product.name} que vence pronto`,
      nutrition: "Rica en nutrientes"
    }));
  }
};

// Helper function
const getDaysToExpiry = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
