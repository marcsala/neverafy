-- SQL Migrations para Fase 5: Sistema de Monetización
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de uso de usuario
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_messages INTEGER DEFAULT 0,
  weekly_products INTEGER DEFAULT 0,
  monthly_ai_queries INTEGER DEFAULT 0,
  products_stored INTEGER DEFAULT 0,
  last_reset_daily TIMESTAMP DEFAULT NOW(),
  last_reset_weekly TIMESTAMP DEFAULT NOW(),
  last_reset_monthly TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla de registros de pago
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(5,2) NOT NULL,
  concept TEXT NOT NULL,
  payment_method TEXT DEFAULT 'bizum',
  subscription_months INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  completed_at TIMESTAMP NULL,
  failed_at TIMESTAMP NULL,
  refunded_at TIMESTAMP NULL,
  error_message TEXT NULL,
  refund_reason TEXT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla de errores de pago
CREATE TABLE IF NOT EXISTS payment_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL,
  amount DECIMAL(5,2),
  concept TEXT,
  transaction_id TEXT,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  webhook_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Extender tabla de usuarios WhatsApp
ALTER TABLE whatsapp_users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS subscription_activated_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS last_expiration_reminder TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS downgraded_at TIMESTAMP NULL;

-- 5. Tabla para mensajes programados
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  scheduled_for TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  context_data JSONB DEFAULT '{}',
  sent_at TIMESTAMP NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tabla para estadísticas diarias
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  total_active_users INTEGER DEFAULT 0,
  free_users INTEGER DEFAULT 0,
  premium_users INTEGER DEFAULT 0,
  limit_hits INTEGER DEFAULT 0,
  conversion_opportunities INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Tabla para eventos de uso
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Tabla para usuarios activos diarios
CREATE TABLE IF NOT EXISTS daily_active_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  last_activity TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 9. Tabla para uso de features
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_duration INTEGER NULL,
  used_at TIMESTAMP NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Tabla para eventos de conversión
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  conversion_type TEXT NOT NULL,
  revenue DECIMAL(10,2) NOT NULL,
  converted_at TIMESTAMP NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Tabla para métricas de usuario
CREATE TABLE IF NOT EXISTS user_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE UNIQUE,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  upsell_opportunities INTEGER DEFAULT 0,
  last_conversion_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 12. Tabla para logs de errores
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT,
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 13. Tabla para reportes de admin
CREATE TABLE IF NOT EXISTS admin_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_type TEXT NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES para optimizar consultas

-- Índices para mensajes programados
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_due ON scheduled_messages(scheduled_for) WHERE status = 'pending';

-- Índices para suscripciones
CREATE INDEX IF NOT EXISTS idx_whatsapp_users_subscription ON whatsapp_users(subscription_tier, subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_users_active ON whatsapp_users(is_active, updated_at);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_products_expiry ON products(expiry_date, user_id);

-- Índices para eventos de uso
CREATE INDEX IF NOT EXISTS idx_usage_events_date ON usage_events(event_date, user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_type ON usage_events(user_id, event_type);

-- Índices para métricas
CREATE INDEX IF NOT EXISTS idx_conversion_events_date ON conversion_events(converted_at);
CREATE INDEX IF NOT EXISTS idx_daily_active_date ON daily_active_users(date);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature_name, used_at);

-- Índices para pagos
CREATE INDEX IF NOT EXISTS idx_payment_records_user ON payment_records(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_records_date ON payment_records(created_at, status);

-- FUNCIONES ÚTILES

-- Función para incrementar uso
CREATE OR REPLACE FUNCTION increment_usage(user_id UUID, field_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO user_usage (user_id, daily_messages, weekly_products, monthly_ai_queries, products_stored)
  VALUES (user_id, 
    CASE WHEN field_name = 'daily_messages' THEN 1 ELSE 0 END,
    CASE WHEN field_name = 'weekly_products' THEN 1 ELSE 0 END,
    CASE WHEN field_name = 'monthly_ai_queries' THEN 1 ELSE 0 END,
    0
  )
  ON CONFLICT (user_id) DO UPDATE SET
    daily_messages = user_usage.daily_messages + (CASE WHEN field_name = 'daily_messages' THEN 1 ELSE 0 END),
    weekly_products = user_usage.weekly_products + (CASE WHEN field_name = 'weekly_products' THEN 1 ELSE 0 END),
    monthly_ai_queries = user_usage.monthly_ai_queries + (CASE WHEN field_name = 'monthly_ai_queries' THEN 1 ELSE 0 END),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar métricas de usuario
CREATE OR REPLACE FUNCTION increment_user_metric(user_id UUID, metric_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO user_metrics (user_id, upsell_opportunities)
  VALUES (user_id, CASE WHEN metric_name = 'upsell_opportunities' THEN 1 ELSE 0 END)
  ON CONFLICT (user_id) DO UPDATE SET
    upsell_opportunities = user_metrics.upsell_opportunities + 
      (CASE WHEN metric_name = 'upsell_opportunities' THEN 1 ELSE 0 END),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- SEGURIDAD: Row Level Security (RLS)

-- Activar RLS en tablas sensibles
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (usuarios solo pueden ver sus propios datos)
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payment_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own metrics" ON user_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- COMENTARIOS
COMMENT ON TABLE user_usage IS 'Tracking de límites de uso por usuario';
COMMENT ON TABLE payment_records IS 'Registro completo de todos los pagos Bizum';
COMMENT ON TABLE scheduled_messages IS 'Cola de mensajes programados para envío automatizado';
COMMENT ON TABLE conversion_events IS 'Eventos de conversión para analytics';
COMMENT ON TABLE daily_active_users IS 'Usuarios activos por día para métricas de engagement';

-- Datos iniciales
INSERT INTO daily_stats (date, total_active_users, free_users, premium_users) 
VALUES (CURRENT_DATE, 0, 0, 0) 
ON CONFLICT (date) DO NOTHING;

-- Finalizado
SELECT 'Fase 5 database setup completed successfully!' as status;
