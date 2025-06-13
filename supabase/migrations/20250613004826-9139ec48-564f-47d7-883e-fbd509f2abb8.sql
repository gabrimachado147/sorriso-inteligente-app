
-- Criar tabela para agendamentos
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service text NOT NULL,
  clinic text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  source text DEFAULT 'webhook',
  webhook_session_id text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de agendamentos via webhook (público)
CREATE POLICY "Allow webhook appointments creation" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

-- Política para visualização de agendamentos (público para admin)
CREATE POLICY "Allow appointments view" 
  ON public.appointments 
  FOR SELECT 
  USING (true);

-- Política para atualização de agendamentos
CREATE POLICY "Allow appointments update" 
  ON public.appointments 
  FOR UPDATE 
  USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_appointments_updated_at_trigger
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

-- Índices para performance
CREATE INDEX idx_appointments_phone ON public.appointments(phone);
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_webhook_session ON public.appointments(webhook_session_id);
