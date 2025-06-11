/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly XAI_API_KEY?: string;
  readonly VITE_API_URL: string;
  // ...adicione outras variáveis de ambiente necessárias...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
