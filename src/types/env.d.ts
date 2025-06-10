/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // ...adicione outras variáveis de ambiente necessárias...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
