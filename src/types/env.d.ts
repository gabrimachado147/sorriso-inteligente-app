interface ImportMeta {
  env: {
    [key: string]: string | undefined;
    NODE_ENV: 'development' | 'production' | 'test';
    // Add your custom environment variables here
    API_URL?: string;
    WHATSAPP_API_KEY?: string;
  };
}
