
-- Adicionar colunas de desconto e forma de pagamento à tabela appointments
ALTER TABLE appointments 
ADD COLUMN discount_percent DECIMAL(5,2) DEFAULT 0,
ADD COLUMN payment_method TEXT,
ADD COLUMN original_price DECIMAL(10,2);

-- Adicionar comentários explicativos
COMMENT ON COLUMN appointments.discount_percent IS 'Percentual de desconto aplicado (0-100)';
COMMENT ON COLUMN appointments.payment_method IS 'Forma de pagamento escolhida';
COMMENT ON COLUMN appointments.original_price IS 'Preço original antes do desconto';
