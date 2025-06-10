// Re-export all Supabase integration modules for easy importing
export { supabase } from './client'

// Authentication
export * from './auth'

// Database operations
export * from './database'

// Real-time subscriptions
export * from './realtime'

// TypeScript types
export * from './types'

// Main client instance (already exported above, but for completeness)
import { supabase } from './client'
export default supabase
