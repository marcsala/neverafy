-- SQL adicional para Fase 3: IA Conversacional Avanzada
-- Ejecutar DESPUÉS del SQL de create_tables.sql

-- Tabla para historial de conversación detallado
CREATE TABLE IF NOT EXISTS conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  intent TEXT,
  entities JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para preferencias de usuario (para personalización)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE UNIQUE,
  dietary_restrictions TEXT[] DEFAULT '{}',
  favorite_cuisines TEXT[] DEFAULT '{}',
  cooking_skill_level TEXT DEFAULT 'beginner' CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_meal_times JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  language_preference TEXT DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para tracking de recetas sugeridas
CREATE TABLE IF NOT EXISTS recipe_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  recipe_name TEXT NOT NULL,
  ingredients_used TEXT[] NOT NULL,
  estimated_prep_time INTEGER, -- en minutos
  meal_type TEXT,
  was_helpful BOOLEAN,
  user_feedback TEXT,
  suggested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_conversation_history_user_timestamp ON conversation_history(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_history_role ON conversation_history(role);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_suggestions_user ON recipe_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_suggestions_helpful ON recipe_suggestions(was_helpful);

-- Trigger para actualizar updated_at en user_preferences
CREATE TRIGGER IF NOT EXISTS update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_suggestions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY IF NOT EXISTS "Users can access own conversation history" ON conversation_history
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = conversation_history.user_id));

CREATE POLICY IF NOT EXISTS "Users can access own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = user_preferences.user_id));

CREATE POLICY IF NOT EXISTS "Users can access own recipe suggestions" ON recipe_suggestions
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = recipe_suggestions.user_id));

-- Service role access
CREATE POLICY IF NOT EXISTS "Service role can access all conversation history" ON conversation_history
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all user preferences" ON user_preferences
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all recipe suggestions" ON recipe_suggestions
    FOR ALL USING (auth.role() = 'service_role');

-- Función para limpiar historial antiguo automáticamente
CREATE OR REPLACE FUNCTION cleanup_old_conversation_history()
RETURNS void AS $$
BEGIN
    -- Eliminar mensajes de más de 30 días
    DELETE FROM conversation_history 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    -- Eliminar contextos expirados
    DELETE FROM conversation_context 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE conversation_history IS 'Historial completo de conversaciones del bot para contexto';
COMMENT ON TABLE user_preferences IS 'Preferencias del usuario para personalización';
COMMENT ON TABLE recipe_suggestions IS 'Tracking de recetas sugeridas y feedback';

COMMENT ON COLUMN conversation_history.role IS 'user o assistant';
COMMENT ON COLUMN conversation_history.intent IS 'Intención detectada por la IA';
COMMENT ON COLUMN conversation_history.entities IS 'Entidades extraídas del mensaje';

COMMENT ON COLUMN user_preferences.dietary_restrictions IS 'Restricciones dietéticas: vegetarian, vegan, gluten_free, etc';
COMMENT ON COLUMN user_preferences.cooking_skill_level IS 'Nivel de cocina para ajustar complejidad de recetas';
COMMENT ON COLUMN user_preferences.preferred_meal_times IS 'JSON con horarios preferidos para comidas';
