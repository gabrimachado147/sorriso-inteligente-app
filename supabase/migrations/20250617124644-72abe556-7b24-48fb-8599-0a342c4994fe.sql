
-- Adicionar coluna price à tabela appointments
ALTER TABLE appointments 
ADD COLUMN price DECIMAL(10,2);

-- Adicionar comentário explicativo
COMMENT ON COLUMN appointments.price IS 'Preço do serviço em reais';
