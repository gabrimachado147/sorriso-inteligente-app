-- Sorriso Inteligente PWA - Supabase Database Schema
-- Execute these commands in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ========================================
-- CORE TABLES
-- ========================================

-- Users/Patients table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    cpf TEXT UNIQUE,
    emergency_contact TEXT,
    emergency_phone TEXT,
    medical_conditions TEXT[],
    allergies TEXT[],
    insurance_provider TEXT,
    insurance_number TEXT,
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinics table
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    neighborhood TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    whatsapp TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    specialties TEXT[] NOT NULL,
    working_hours JSONB,
    emergency_available BOOLEAN DEFAULT false,
    accepts_insurance BOOLEAN DEFAULT false,
    insurance_providers TEXT[],
    images TEXT[],
    verified BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services offered by clinics
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'preventive', 'restorative', 'cosmetic', 'surgical', 'emergency'
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10, 2),
    price_max DECIMAL(10, 2), -- for price ranges
    requires_consultation BOOLEAN DEFAULT false,
    preparation_instructions TEXT,
    recovery_time TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dental professionals
CREATE TABLE IF NOT EXISTS public.dentists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    cro_number TEXT NOT NULL UNIQUE, -- CRO registration number
    specialties TEXT[] NOT NULL,
    experience_years INTEGER,
    education TEXT[],
    languages TEXT[] DEFAULT '{"Portuguese"}',
    photo_url TEXT,
    bio TEXT,
    consultation_fee DECIMAL(10, 2),
    available_days TEXT[] DEFAULT '{"monday","tuesday","wednesday","thursday","friday"}',
    available_hours JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    dentist_id UUID REFERENCES public.dentists(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- in minutes
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    appointment_type TEXT NOT NULL DEFAULT 'regular' CHECK (appointment_type IN ('regular', 'emergency', 'consultation', 'followup')),
    symptoms TEXT,
    notes TEXT,
    dentist_notes TEXT,
    total_cost DECIMAL(10, 2),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'refunded')),
    payment_method TEXT,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    dentist_id UUID REFERENCES public.dentists(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    would_recommend BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- PWA SPECIFIC TABLES
-- ========================================

-- PWA Installation tracking
CREATE TABLE IF NOT EXISTS public.pwa_installations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    device_type TEXT, -- 'mobile', 'desktop', 'tablet'
    browser TEXT,
    platform TEXT, -- 'android', 'ios', 'windows', 'macos', 'linux'
    install_source TEXT, -- 'browser_prompt', 'manual', 'shortcut'
    user_agent TEXT,
    installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Push notifications
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh_key TEXT NOT NULL,
    auth_key TEXT NOT NULL,
    user_agent TEXT,
    active BOOLEAN DEFAULT true,
    notification_preferences JSONB DEFAULT '{"appointments": true, "promotions": false, "reminders": true, "updates": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offline sync queue
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
    data JSONB,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Chat messages (for dental AI assistant)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    context JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_messages INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'bot', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON public.appointments(patient_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_date ON public.appointments(clinic_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_upcoming ON public.appointments(appointment_date, appointment_time) WHERE status IN ('pending', 'confirmed');

-- Clinics indexes
CREATE INDEX IF NOT EXISTS idx_clinics_specialties ON public.clinics USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_clinics_location ON public.clinics(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_clinics_rating ON public.clinics(rating DESC);
CREATE INDEX IF NOT EXISTS idx_clinics_featured ON public.clinics(featured) WHERE featured = true;

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_clinic ON public.reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_dentist ON public.reviews(dentist_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- PWA indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions(user_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_sync_queue_unprocessed ON public.sync_queue(created_at) WHERE processed = false;

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dentists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Clinics are publicly readable
CREATE POLICY "Clinics are publicly readable" ON public.clinics
    FOR SELECT USING (true);

-- Services are publicly readable
CREATE POLICY "Services are publicly readable" ON public.services
    FOR SELECT USING (true);

-- Dentists are publicly readable
CREATE POLICY "Dentists are publicly readable" ON public.dentists
    FOR SELECT USING (true);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Users can create own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Users can update own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid()::text = patient_id::text);

-- Reviews policies
CREATE POLICY "Reviews are publicly readable" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

-- PWA specific policies
CREATE POLICY "Users can manage own PWA data" ON public.pwa_installations
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own sync queue" ON public.sync_queue
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can access own chat messages" ON public.chat_messages
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.chat_sessions 
        WHERE chat_sessions.id = chat_messages.session_id 
        AND chat_sessions.user_id::text = auth.uid()::text
    ));

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON public.clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dentists_updated_at BEFORE UPDATE ON public.dentists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON public.push_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update clinic ratings
CREATE OR REPLACE FUNCTION update_clinic_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.clinics SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2) 
            FROM public.reviews 
            WHERE clinic_id = NEW.clinic_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE clinic_id = NEW.clinic_id
        )
    WHERE id = NEW.clinic_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for clinic rating updates
CREATE TRIGGER update_clinic_rating_trigger 
    AFTER INSERT OR UPDATE ON public.reviews 
    FOR EACH ROW EXECUTE FUNCTION update_clinic_rating();

-- Function to update dentist ratings
CREATE OR REPLACE FUNCTION update_dentist_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.dentists SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2) 
            FROM public.reviews 
            WHERE dentist_id = NEW.dentist_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE dentist_id = NEW.dentist_id
        )
    WHERE id = NEW.dentist_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for dentist rating updates
CREATE TRIGGER update_dentist_rating_trigger 
    AFTER INSERT OR UPDATE ON public.reviews 
    FOR EACH ROW EXECUTE FUNCTION update_dentist_rating();
