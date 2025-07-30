-- SQL para crear las tablas necesarias para el bot de WhatsApp
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de usuarios de WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  is_active BOOLEAN DEFAULT true,
  preferred_alert_time TIME DEFAULT '09:00:00',
  timezone TEXT DEFAULT 'Europe/Madrid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de contexto de conversación
CREATE TABLE IF NOT EXISTS conversation_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  last_intent TEXT,
  pending_action TEXT,
  context_data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_whatsapp_users_phone ON whatsapp_users(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_users_active ON whatsapp_users(is_active);
CREATE INDEX IF NOT EXISTS idx_conversation_context_user ON conversation_context(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_context_expires ON conversation_context(expires_at);

-- 4. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger para actualizar updated_at en whatsapp_users
CREATE TRIGGER IF NOT EXISTS update_whatsapp_users_updated_at 
    BEFORE UPDATE ON whatsapp_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS (Row Level Security) - opcional para mayor seguridad
ALTER TABLE whatsapp_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_context ENABLE ROW LEVEL SECURITY;

-- 7. Política para permitir acceso a los propios datos (si se implementa auth)
CREATE POLICY IF NOT EXISTS "Users can access own data" ON whatsapp_users
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can access own conversation context" ON conversation_context
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = conversation_context.user_id));

-- 8. Para el servicio del bot (acceso total temporal)
CREATE POLICY IF NOT EXISTS "Service role can access all data" ON whatsapp_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all conversation context" ON conversation_context
    FOR ALL USING (auth.role() = 'service_role');

-- 9. Comentarios para documentación
COMMENT ON TABLE whatsapp_users IS 'Usuarios del bot de WhatsApp de Neverafy';
COMMENT ON TABLE conversation_context IS 'Contexto de conversación para mantener estado entre mensajes';

COMMENT ON COLUMN whatsapp_users.phone_number IS 'Número de teléfono en formato internacional sin +';
COMMENT ON COLUMN whatsapp_users.user_id IS 'Referencia a auth.users si el usuario tiene cuenta web';
COMMENT ON COLUMN whatsapp_users.subscription_tier IS 'free o premium';
COMMENT ON COLUMN whatsapp_users.preferred_alert_time IS 'Hora preferida para recibir alertas';

COMMENT ON COLUMN conversation_context.context_data IS 'Datos JSON del contexto de conversación';
COMMENT ON COLUMN conversation_context.expires_at IS 'Cuando expira el contexto (30 min típicamente)';
