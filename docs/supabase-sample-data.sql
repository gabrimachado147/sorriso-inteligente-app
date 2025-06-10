-- Sorriso Inteligente PWA - Sample Data for Development
-- Execute after creating the main schema

-- ========================================
-- SAMPLE CLINICS
-- ========================================

INSERT INTO public.clinics (id, name, description, address, neighborhood, city, state, postal_code, latitude, longitude, phone, email, website, whatsapp, rating, total_reviews, specialties, working_hours, emergency_available, accepts_insurance, insurance_providers, images, verified, featured) VALUES

('550e8400-e29b-41d4-a716-446655440001', 
 'Clínica Sorriso Campo Belo', 
 'Clínica odontológica completa com tecnologia de ponta e profissionais especializados.',
 'Rua Campo Belo, 1234',
 'Campo Belo',
 'São Paulo',
 'SP',
 '04607-000',
 -23.6158,
 -46.6739,
 '(11) 3456-7890',
 'contato@sorrisocampobelo.com.br',
 'https://sorrisocampobelo.com.br',
 '5511987654321',
 4.8,
 156,
 ARRAY['Implantodontia', 'Ortodontia', 'Clínica Geral', 'Endodontia'],
 '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "08:00", "close": "12:00"}}',
 true,
 true,
 ARRAY['Unimed', 'Bradesco Saúde', 'Amil'],
 ARRAY['/images/clinic1-1.jpg', '/images/clinic1-2.jpg'],
 true,
 true),

('550e8400-e29b-41d4-a716-446655440002',
 'Dental Care Vila Madalena',
 'Especializada em estética dental e tratamentos preventivos.',
 'Rua Harmonia, 567',
 'Vila Madalena',
 'São Paulo',
 'SP',
 '05435-000',
 -23.5505,
 -46.6880,
 '(11) 2345-6789',
 'contato@dentalcare.com.br',
 'https://dentalcare.com.br',
 '5511876543210',
 4.6,
 89,
 ARRAY['Estética Dental', 'Clareamento', 'Facetas', 'Clínica Geral'],
 '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "19:00"}, "friday": {"open": "09:00", "close": "19:00"}}',
 false,
 true,
 ARRAY['SulAmérica', 'Porto Seguro'],
 ARRAY['/images/clinic2-1.jpg'],
 true,
 false),

('550e8400-e29b-41d4-a716-446655440003',
 'Centro Odontológico 24h',
 'Atendimento 24 horas para emergências odontológicas.',
 'Av. Paulista, 1000',
 'Bela Vista',
 'São Paulo',
 'SP',
 '01310-100',
 -23.5613,
 -46.6565,
 '(11) 1234-5678',
 'emergencia@odonto24h.com.br',
 'https://odonto24h.com.br',
 '5511765432109',
 4.4,
 234,
 ARRAY['Emergência', 'Cirurgia Oral', 'Periodontia', 'Clínica Geral'],
 '{"monday": {"open": "00:00", "close": "23:59"}, "tuesday": {"open": "00:00", "close": "23:59"}, "wednesday": {"open": "00:00", "close": "23:59"}, "thursday": {"open": "00:00", "close": "23:59"}, "friday": {"open": "00:00", "close": "23:59"}, "saturday": {"open": "00:00", "close": "23:59"}, "sunday": {"open": "00:00", "close": "23:59"}}',
 true,
 true,
 ARRAY['Unimed', 'Bradesco Saúde', 'Amil', 'SulAmérica'],
 ARRAY['/images/clinic3-1.jpg', '/images/clinic3-2.jpg', '/images/clinic3-3.jpg'],
 true,
 true);

-- ========================================
-- SAMPLE DENTISTS
-- ========================================

INSERT INTO public.dentists (id, clinic_id, full_name, cro_number, specialties, experience_years, education, languages, photo_url, bio, consultation_fee, available_days, available_hours, rating, total_reviews) VALUES

('650e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 'Dr. Roberto Silva',
 'CRO-SP-45678',
 ARRAY['Implantodontia', 'Cirurgia Oral'],
 15,
 ARRAY['Faculdade de Odontologia - USP', 'Especialização em Implantodontia - APCD'],
 ARRAY['Português', 'Inglês'],
 '/images/dr-roberto.jpg',
 'Especialista em implantodontia com mais de 15 anos de experiência. Focado em reabilitação oral completa.',
 200.00,
 ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
 '{"morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}}',
 4.9,
 78),

('650e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440001',
 'Dra. Maria Santos',
 'CRO-SP-56789',
 ARRAY['Ortodontia', 'Odontopediatria'],
 12,
 ARRAY['Faculdade de Odontologia - UNICAMP', 'Especialização em Ortodontia - PROFIS'],
 ARRAY['Português', 'Espanhol'],
 '/images/dra-maria.jpg',
 'Especialista em ortodontia e odontopediatria. Atendimento humanizado para todas as idades.',
 180.00,
 ARRAY['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
 '{"morning": {"start": "09:00", "end": "13:00"}, "afternoon": {"start": "14:00", "end": "17:00"}}',
 4.8,
 92),

('650e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440002',
 'Dr. Carlos Mendes',
 'CRO-SP-67890',
 ARRAY['Estética Dental', 'Prótese'],
 8,
 ARRAY['Faculdade de Odontologia - PUC-SP', 'Especialização em Prótese - São Leopoldo Mandic'],
 ARRAY['Português'],
 '/images/dr-carlos.jpg',
 'Especialista em estética dental e prótese. Transformando sorrisos com técnicas modernas.',
 220.00,
 ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
 '{"morning": {"start": "09:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "19:00"}}',
 4.7,
 65);

-- ========================================
-- SAMPLE SERVICES
-- ========================================

INSERT INTO public.services (id, clinic_id, name, description, category, duration, price, price_max, requires_consultation, preparation_instructions, recovery_time, active) VALUES

-- Campo Belo Services
('750e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 'Consulta de Avaliação',
 'Consulta inicial para avaliação geral e diagnóstico.',
 'preventive',
 60,
 150.00,
 NULL,
 false,
 'Trazer documentos e histórico médico.',
 'Nenhum',
 true),

('750e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440001',
 'Limpeza Dental',
 'Profilaxia completa com remoção de tártaro e polimento.',
 'preventive',
 45,
 120.00,
 NULL,
 false,
 'Evitar alimentos pigmentantes 24h antes.',
 '2-4 horas',
 true),

('750e8400-e29b-41d4-a716-446655440003',
 '550e8400-e29b-41d4-a716-446655440001',
 'Implante Dentário',
 'Implante unitário com coroa protética.',
 'surgical',
 120,
 2500.00,
 4000.00,
 true,
 'Jejum de 8 horas. Tomar antibiótico conforme prescrição.',
 '7-14 dias',
 true),

('750e8400-e29b-41d4-a716-446655440004',
 '550e8400-e29b-41d4-a716-446655440001',
 'Aparelho Ortodôntico',
 'Instalação de aparelho fixo metálico ou estético.',
 'cosmetic',
 90,
 800.00,
 1500.00,
 true,
 'Limpeza dental prévia obrigatória.',
 'Adaptação de 3-7 dias',
 true),

-- Vila Madalena Services
('750e8400-e29b-41d4-a716-446655440005',
 '550e8400-e29b-41d4-a716-446655440002',
 'Clareamento Dental',
 'Clareamento a laser para dentes mais brancos.',
 'cosmetic',
 90,
 600.00,
 1200.00,
 false,
 'Evitar alimentos pigmentantes 48h antes e depois.',
 '24-48 horas',
 true),

('750e8400-e29b-41d4-a716-446655440006',
 '550e8400-e29b-41d4-a716-446655440002',
 'Facetas de Porcelana',
 'Facetas ultrafinas para transformação do sorriso.',
 'cosmetic',
 180,
 1200.00,
 2000.00,
 true,
 'Moldagem prévia e planejamento digital.',
 '2-3 dias',
 true),

-- 24h Emergency Services
('750e8400-e29b-41d4-a716-446655440007',
 '550e8400-e29b-41d4-a716-446655440003',
 'Emergência Dental',
 'Atendimento imediato para dor ou trauma dental.',
 'emergency',
 60,
 200.00,
 500.00,
 false,
 'Comparecer imediatamente.',
 'Varia conforme caso',
 true),

('750e8400-e29b-41d4-a716-446655440008',
 '550e8400-e29b-41d4-a716-446655440003',
 'Extração Simples',
 'Remoção de dente com técnica minimamente invasiva.',
 'surgical',
 45,
 180.00,
 300.00,
 false,
 'Jejum de 2 horas. Evitar anticoagulantes.',
 '3-5 dias',
 true);

-- ========================================
-- SAMPLE USERS (for testing)
-- ========================================

INSERT INTO public.users (id, email, full_name, phone, date_of_birth, cpf, emergency_contact, emergency_phone, medical_conditions, allergies) VALUES

('450e8400-e29b-41d4-a716-446655440001',
 'joao.silva@email.com',
 'João Silva',
 '(11) 99999-1234',
 '1985-06-15',
 '123.456.789-00',
 'Maria Silva',
 '(11) 88888-5678',
 ARRAY['Hipertensão'],
 ARRAY['Penicilina']),

('450e8400-e29b-41d4-a716-446655440002',
 'ana.santos@email.com',
 'Ana Santos',
 '(11) 99999-5678',
 '1990-03-22',
 '987.654.321-00',
 'Carlos Santos',
 '(11) 88888-1234',
 ARRAY[],
 ARRAY['Látex']);

-- ========================================
-- SAMPLE APPOINTMENTS
-- ========================================

INSERT INTO public.appointments (id, patient_id, clinic_id, dentist_id, service_id, appointment_date, appointment_time, duration, status, appointment_type, symptoms, notes, total_cost, payment_status) VALUES

('850e8400-e29b-41d4-a716-446655440001',
 '450e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440001',
 '750e8400-e29b-41d4-a716-446655440001',
 CURRENT_DATE + INTERVAL '3 days',
 '14:00',
 60,
 'confirmed',
 'regular',
 'Dor no dente 36',
 'Paciente relatou dor intensa há 2 dias',
 150.00,
 'pending'),

('850e8400-e29b-41d4-a716-446655440002',
 '450e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440002',
 '650e8400-e29b-41d4-a716-446655440003',
 '750e8400-e29b-41d4-a716-446655440005',
 CURRENT_DATE + INTERVAL '7 days',
 '10:00',
 90,
 'pending',
 'regular',
 NULL,
 'Interesse em clareamento dental',
 600.00,
 'pending');

-- ========================================
-- SAMPLE REVIEWS
-- ========================================

INSERT INTO public.reviews (id, patient_id, clinic_id, dentist_id, appointment_id, rating, title, comment, would_recommend, verified) VALUES

('950e8400-e29b-41d4-a716-446655440001',
 '450e8400-e29b-41d4-a716-446655440001',
 '550e8400-e29b-41d4-a716-446655440001',
 '650e8400-e29b-41d4-a716-446655440001',
 NULL,
 5,
 'Excelente atendimento!',
 'Dr. Roberto é muito competente e a clínica tem uma estrutura incrível. Recomendo a todos!',
 true,
 true),

('950e8400-e29b-41d4-a716-446655440002',
 '450e8400-e29b-41d4-a716-446655440002',
 '550e8400-e29b-41d4-a716-446655440002',
 '650e8400-e29b-41d4-a716-446655440003',
 NULL,
 4,
 'Bom atendimento',
 'Clareamento ficou ótimo, mas o tempo de espera foi um pouco longo.',
 true,
 true);

-- ========================================
-- UPDATE STATISTICS
-- ========================================

-- This will trigger the rating calculation functions
UPDATE public.reviews SET updated_at = NOW();

COMMIT;
