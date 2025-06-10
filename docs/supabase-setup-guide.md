# 🚀 Supabase Setup Guide for Sorriso Inteligente PWA

## Overview

This guide will walk you through setting up Supabase for your dental PWA, from database creation to production deployment.

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Node.js 18+ installed
- Basic knowledge of SQL and PostgreSQL

## 🛠️ Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Create New Project**:
   - Name: `sorriso-inteligente-pwa`
   - Database Password: Generate strong password
   - Region: Choose closest to your users (Brazil East recommended)

3. **Wait for Setup**: Project creation takes 2-3 minutes

## 🗄️ Step 2: Database Schema Setup

### Execute Schema Script

1. **Open SQL Editor** in Supabase Dashboard
2. **Copy and execute** the contents of `docs/supabase-schema.sql`
3. **Run the script** - it will create all tables, indexes, and security policies

### Load Sample Data (Optional)

1. **Execute** `docs/supabase-sample-data.sql` for development data
2. **Verify tables** were created in the Table Editor

## 🔐 Step 3: Authentication Setup

### Enable Email Authentication

1. **Go to Authentication > Settings**
2. **Enable Email provider**
3. **Configure email templates** (optional)
4. **Set site URL**: `https://your-domain.com` (production)

### Configure Row Level Security

RLS is automatically enabled by our schema. Users can only:
- View/edit their own profile
- View public clinic/service data
- Manage their own appointments
- Access their own PWA data

## 🔑 Step 4: Get API Keys

### Development/Local
```bash
# In Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Production
```bash
# Same keys, but ensure proper environment separation
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Server-side only
```

## 📱 Step 5: PWA Integration

### Install Dependencies
```bash
npm install @supabase/supabase-js
```

### Update Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=https://bstppllwgzkacxxwhpes.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Test Connection
```typescript
// Test in your app
import { supabase } from '@/integrations/supabase/client'

const testConnection = async () => {
  const { data, error } = await supabase
    .from('clinics')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('Connection failed:', error)
  } else {
    console.log('✅ Supabase connected successfully!')
  }
}
```

## 🔧 Step 6: Database Functions (Optional)

### Nearby Clinics Function
```sql
-- Execute in SQL Editor for location-based searches
CREATE OR REPLACE FUNCTION get_nearby_clinics(
  lat float,
  lng float,
  radius_km float DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  latitude decimal,
  longitude decimal,
  distance_km float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.address,
    c.latitude,
    c.longitude,
    (
      6371 * acos(
        cos(radians(lat)) * cos(radians(c.latitude::float)) *
        cos(radians(c.longitude::float) - radians(lng)) +
        sin(radians(lat)) * sin(radians(c.latitude::float))
      )
    ) AS distance_km
  FROM clinics c
  WHERE c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
    AND c.verified = true
  HAVING distance_km <= radius_km
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

## 📊 Step 7: Monitoring and Analytics

### Enable Realtime (Optional)
```sql
-- For real-time appointment updates
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE push_subscriptions;
```

### Setup Database Backups
1. **Go to Settings > Database**
2. **Enable automatic backups**
3. **Set retention period** (7 days recommended)

## 🚀 Step 8: Production Deployment

### Environment Variables
```bash
# Production .env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_ENVIRONMENT=production
```

### Security Checklist
- ✅ RLS enabled on all tables
- ✅ Anon key rate limiting configured
- ✅ Email auth configured
- ✅ Database backups enabled
- ✅ Environment variables secured

## 📈 Step 9: Performance Optimization

### Database Indexes
Our schema includes optimized indexes for:
- Appointment queries by user/clinic/date
- Clinic searches by specialty/location
- Review aggregations
- PWA sync operations

### Connection Pooling
Supabase automatically handles connection pooling, but for high-traffic apps:
```javascript
// Use connection pooling for server-side operations
const supabaseServerClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false
    }
  }
)
```

## 🛡️ Step 10: Security Best Practices

### API Key Management
- ✅ Never commit API keys to version control
- ✅ Use environment variables
- ✅ Different projects for dev/staging/production
- ✅ Rotate keys periodically

### Row Level Security
- ✅ Test RLS policies thoroughly
- ✅ Use `auth.uid()` for user-specific data
- ✅ Limit public access to necessary data only

### Data Validation
```typescript
// Always validate data before inserting
const createAppointment = async (data: NewAppointment) => {
  // Validate required fields
  if (!data.patient_id || !data.clinic_id || !data.appointment_date) {
    throw new Error('Missing required fields')
  }
  
  // Validate appointment is in the future
  const appointmentDateTime = new Date(`${data.appointment_date}T${data.appointment_time}`)
  if (appointmentDateTime <= new Date()) {
    throw new Error('Appointment must be in the future')
  }
  
  return AppointmentService.create(data)
}
```

## 🧪 Step 11: Testing

### Unit Tests
```typescript
// Example test for appointment service
describe('AppointmentService', () => {
  test('should create appointment', async () => {
    const newAppointment = {
      patient_id: 'test-user-id',
      clinic_id: 'test-clinic-id',
      appointment_date: '2025-12-25',
      appointment_time: '14:00'
    }
    
    const appointment = await AppointmentService.create(newAppointment)
    expect(appointment.id).toBeDefined()
    expect(appointment.status).toBe('pending')
  })
})
```

### Integration Tests
```typescript
// Test database connection and basic operations
describe('Database Integration', () => {
  test('should connect to database', async () => {
    const { data, error } = await supabase
      .from('clinics')
      .select('count')
      .limit(1)
    
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
```

## 📚 Step 12: Usage Examples

### Basic Operations
```typescript
// Get user appointments
const appointments = await AppointmentService.getUserAppointments(userId, {
  upcoming: true,
  limit: 10
})

// Search clinics
const clinics = await ClinicService.search('ortodontia', {
  city: 'São Paulo',
  emergency: false
})

// Create appointment
const newAppointment = await AppointmentService.create({
  patient_id: user.id,
  clinic_id: selectedClinic.id,
  appointment_date: '2025-06-15',
  appointment_time: '14:00',
  duration: 60
})
```

### PWA Features
```typescript
// Track PWA installation
const trackInstallation = async () => {
  await supabase.from('pwa_installations').insert({
    user_id: user.id,
    device_type: 'mobile',
    platform: 'android',
    install_source: 'browser_prompt'
  })
}

// Manage push subscriptions
const subscribeToPush = async (subscription: PushSubscription) => {
  await supabase.from('push_subscriptions').insert({
    user_id: user.id,
    endpoint: subscription.endpoint,
    p256dh_key: subscription.keys.p256dh,
    auth_key: subscription.keys.auth
  })
}
```

## 🔄 Step 13: Migrations and Updates

### Schema Updates
```sql
-- Example migration for adding new features
ALTER TABLE appointments ADD COLUMN telemedicine_url TEXT;
ALTER TABLE services ADD COLUMN online_available BOOLEAN DEFAULT false;

-- Update RLS policies if needed
CREATE POLICY "Users can view telemedicine URLs for own appointments" 
  ON appointments FOR SELECT 
  USING (auth.uid()::text = patient_id::text AND telemedicine_url IS NOT NULL);
```

### Data Migrations
```typescript
// Migrate existing data when needed
const migrateData = async () => {
  const { data: oldAppointments } = await supabase
    .from('appointments')
    .select('*')
    .is('duration', null)
  
  // Update appointments without duration
  for (const apt of oldAppointments || []) {
    await supabase
      .from('appointments')
      .update({ duration: 60 }) // Default 1 hour
      .eq('id', apt.id)
  }
}
```

## ⚡ Performance Tips

1. **Use select() wisely**: Only fetch needed columns
2. **Implement pagination**: Use limit() and offset()
3. **Cache frequently accessed data**: Clinics, services, etc.
4. **Use indexes**: Our schema includes optimized indexes
5. **Batch operations**: Use upsert() for multiple records

## 🐛 Troubleshooting

### Common Issues

**Connection Error**
```typescript
// Check API keys and URL
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20) + '...')
```

**RLS Blocking Queries**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'appointments';

-- Temporarily disable for testing (NOT in production)
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
```

**Performance Issues**
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM appointments WHERE patient_id = 'user-id';

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_status 
ON appointments(patient_id, status);
```

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues

---

**✅ Your Supabase setup is now complete!** 

Your PWA can now:
- Store user appointments and profiles
- Search and filter clinics
- Handle offline sync
- Send push notifications
- Track PWA usage analytics

Next steps: Test all features and deploy to production! 🚀
