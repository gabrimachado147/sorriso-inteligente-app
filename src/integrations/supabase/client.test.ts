import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Usa apenas process.env para ambiente de teste/Jest
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://bstppllwgzkacxxwhpes.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_ANON_KEY || (
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdHBwbGx3Z3prYWN4eHdocGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDk2MjgsImV4cCI6MjA2NDYyNTYyOH0." +
  "SiKjaaf41YS0hWvJZa0bQVzDePxAn0JhBP1_qRgmvjM"
);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
