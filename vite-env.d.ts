/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WA_BUSINESS_JID: string;
  readonly VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_EVOLUTION_API_URL: string;
  // ...adicione outras variáveis conforme necessário...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
