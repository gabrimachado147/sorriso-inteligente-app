
-- Criar tabela para histórico de agendamentos do usuário
CREATE TABLE public.user_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, appointment_id)
);

-- Criar tabela para gamificação
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tabela para configurações de notificação
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_reminders BOOLEAN DEFAULT true,
  sms_reminders BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar tabela para configurações de acessibilidade
CREATE TABLE public.accessibility_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  high_contrast BOOLEAN DEFAULT false,
  large_text BOOLEAN DEFAULT false,
  reduced_motion BOOLEAN DEFAULT false,
  screen_reader BOOLEAN DEFAULT false,
  font_size INTEGER DEFAULT 16,
  theme_preference TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Adicionar RLS policies
ALTER TABLE public.user_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para user_appointments
CREATE POLICY "Users can view their own appointments" ON public.user_appointments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own appointments" ON public.user_appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_gamification
CREATE POLICY "Users can view their own gamification" ON public.user_gamification
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own gamification" ON public.user_gamification
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para notification_preferences
CREATE POLICY "Users can manage their notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para accessibility_settings
CREATE POLICY "Users can manage their accessibility settings" ON public.accessibility_settings
  FOR ALL USING (auth.uid() = user_id);

-- Adicionar coluna clinic_access na tabela appointments para filtragem admin
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS clinic_filter TEXT;

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_gamification_updated_at BEFORE UPDATE ON public.user_gamification
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_accessibility_settings_updated_at BEFORE UPDATE ON public.accessibility_settings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
