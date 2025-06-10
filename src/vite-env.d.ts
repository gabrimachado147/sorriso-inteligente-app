/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_EVOLUTION_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ENVIRONMENT: string;
  // Add any other VITE_ variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
