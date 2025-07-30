-- SQL para Fase 4: Sistema de Alertas Automáticas
-- Ejecutar DESPUÉS de phase3_tables.sql

-- Tabla para logs de alertas enviadas
CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- critical, urgent, daily, weekly_report, motivational
  products_count INTEGER DEFAULT 0,
  total_value DECIMAL(10,2) DEFAULT 0.00,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'sent', -- sent, failed, pending
  metadata JSONB DEFAULT '{}'
);

-- Tabla para configuración avanzada de alertas por usuario
CREATE TABLE IF NOT EXISTS alert_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE UNIQUE,
  alert_time TIME DEFAULT '09:00:00',
  timezone TEXT DEFAULT 'Europe/Madrid',
  alert_days INTEGER[] DEFAULT '{1,2,3,4,5,6,7}', -- 1=Monday, 7=Sunday
  min_value_alert DECIMAL(5,2) DEFAULT 1.00,
  urgent_days_threshold INTEGER DEFAULT 2,
  enabled_alert_types TEXT[] DEFAULT '{critical,urgent,daily}',
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para patrones de uso y métricas
CREATE TABLE IF NOT EXISTS user_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE UNIQUE,
  most_active_hour INTEGER DEFAULT 9, -- Hora más activa del día
  avg_products_per_week DECIMAL(5,2) DEFAULT 0.00,
  avg_response_time_minutes INTEGER DEFAULT 0, -- Tiempo promedio de respuesta
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activity_streak_days INTEGER DEFAULT 0, -- Días consecutivos de actividad
  preferred_alert_frequency TEXT DEFAULT 'daily', -- daily, every_other_day, weekly
  engagement_score DECIMAL(3,2) DEFAULT 0.50, -- 0-1 score de engagement
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para tracking de efectividad de alertas
CREATE TABLE IF NOT EXISTS alert_effectiveness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_log_id UUID REFERENCES alert_logs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES whatsapp_users(id) ON DELETE CASCADE,
  user_responded BOOLEAN DEFAULT false,
  response_time_minutes INTEGER,
  action_taken TEXT, -- ignored, viewed_products, added_product, requested_recipe, etc.
  user_feedback TEXT,
  effectiveness_score DECIMAL(3,2), -- 0-1 score
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas de alertas
CREATE INDEX IF NOT EXISTS idx_alert_logs_user_type ON alert_logs(user_id, alert_type);
CREATE INDEX IF NOT EXISTS idx_alert_logs_sent_at ON alert_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_settings_user ON alert_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_settings_active ON alert_settings(is_active, alert_time);
CREATE INDEX IF NOT EXISTS idx_user_patterns_user ON user_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_patterns_activity ON user_patterns(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_alert_effectiveness_user ON alert_effectiveness(user_id);

-- Triggers para mantener updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_alert_settings_updated_at 
    BEFORE UPDATE ON alert_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_user_patterns_updated_at 
    BEFORE UPDATE ON user_patterns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener usuarios que deben recibir alertas en una hora específica
CREATE OR REPLACE FUNCTION get_users_for_alert_hour(target_hour INTEGER)
RETURNS TABLE (
    user_id UUID,
    phone_number TEXT,
    alert_types TEXT[],
    timezone TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wu.id,
        wu.phone_number,
        COALESCE(as_table.enabled_alert_types, '{critical,urgent,daily}'::TEXT[]),
        COALESCE(as_table.timezone, 'Europe/Madrid')
    FROM whatsapp_users wu
    LEFT JOIN alert_settings as_table ON wu.id = as_table.user_id
    WHERE 
        wu.is_active = true
        AND COALESCE(as_table.is_active, true) = true
        AND EXTRACT(hour FROM COALESCE(as_table.alert_time, '09:00:00'::TIME)) = target_hour
        AND EXTRACT(dow FROM NOW()) = ANY(COALESCE(as_table.alert_days, '{1,2,3,4,5,6,7}'::INTEGER[]))
        AND wu.updated_at > NOW() - INTERVAL '30 days'; -- Solo usuarios activos en último mes
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar logs antiguos de alertas
CREATE OR REPLACE FUNCTION cleanup_old_alert_logs()
RETURNS void AS $$
BEGIN
    -- Eliminar logs de alertas de más de 90 días
    DELETE FROM alert_logs 
    WHERE sent_at < NOW() - INTERVAL '90 days';
    
    -- Eliminar datos de efectividad de más de 60 días
    DELETE FROM alert_effectiveness
    WHERE tracked_at < NOW() - INTERVAL '60 days';
    
    -- Log de limpieza
    INSERT INTO alert_logs (user_id, alert_type, products_count, metadata)
    VALUES (
        NULL, 
        'system_cleanup', 
        0, 
        jsonb_build_object('cleaned_at', NOW(), 'action', 'cleanup_old_logs')
    );
END;
$$ LANGUAGE plpgsql;

-- Vista para obtener estadísticas de alertas por usuario
CREATE OR REPLACE VIEW user_alert_stats AS
SELECT 
    u.id as user_id,
    u.phone_number,
    COUNT(al.*) as total_alerts,
    COUNT(al.*) FILTER (WHERE al.alert_type = 'critical') as critical_alerts,
    COUNT(al.*) FILTER (WHERE al.alert_type = 'urgent') as urgent_alerts,
    COUNT(al.*) FILTER (WHERE al.alert_type = 'daily') as daily_alerts,
    COUNT(al.*) FILTER (WHERE al.sent_at > NOW() - INTERVAL '7 days') as alerts_last_week,
    MAX(al.sent_at) as last_alert_sent,
    AVG(ae.effectiveness_score) as avg_effectiveness
FROM whatsapp_users u
LEFT JOIN alert_logs al ON u.id = al.user_id
LEFT JOIN alert_effectiveness ae ON al.id = ae.alert_log_id
GROUP BY u.id, u.phone_number;

-- RLS (Row Level Security)
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_effectiveness ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY IF NOT EXISTS "Users can access own alert logs" ON alert_logs
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = alert_logs.user_id));

CREATE POLICY IF NOT EXISTS "Users can access own alert settings" ON alert_settings
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = alert_settings.user_id));

CREATE POLICY IF NOT EXISTS "Users can access own patterns" ON user_patterns
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = user_patterns.user_id));

CREATE POLICY IF NOT EXISTS "Users can access own alert effectiveness" ON alert_effectiveness
    FOR ALL USING (auth.uid() = (SELECT user_id FROM whatsapp_users WHERE id = alert_effectiveness.user_id));

-- Service role access
CREATE POLICY IF NOT EXISTS "Service role can access all alert logs" ON alert_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all alert settings" ON alert_settings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all user patterns" ON user_patterns
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can access all alert effectiveness" ON alert_effectiveness
    FOR ALL USING (auth.role() = 'service_role');

-- Comentarios para documentación
COMMENT ON TABLE alert_logs IS 'Log de todas las alertas enviadas a usuarios';
COMMENT ON TABLE alert_settings IS 'Configuración personalizada de alertas por usuario';
COMMENT ON TABLE user_patterns IS 'Patrones de uso y métricas de engagement de usuarios';
COMMENT ON TABLE alert_effectiveness IS 'Tracking de efectividad y respuesta a alertas';

COMMENT ON COLUMN alert_logs.alert_type IS 'Tipo: critical, urgent, daily, weekly_report, motivational';
COMMENT ON COLUMN alert_settings.alert_days IS 'Días de la semana: 1=Lunes, 7=Domingo';
COMMENT ON COLUMN alert_settings.enabled_alert_types IS 'Tipos de alerta habilitados para el usuario';
COMMENT ON COLUMN user_patterns.engagement_score IS 'Score 0-1 basado en respuestas y actividad';
COMMENT ON COLUMN alert_effectiveness.effectiveness_score IS 'Score 0-1 de efectividad de la alerta';

-- Datos iniciales: configuraciones por defecto para usuarios existentes
INSERT INTO alert_settings (user_id, alert_time, enabled_alert_types)
SELECT id, '09:00:00', '{critical,urgent,daily}'
FROM whatsapp_users 
WHERE id NOT IN (SELECT user_id FROM alert_settings WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_patterns (user_id, most_active_hour, last_activity)
SELECT id, 9, updated_at
FROM whatsapp_users 
WHERE id NOT IN (SELECT user_id FROM user_patterns WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;
