
// Configurações de desenvolvimento
export const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const DEVELOPMENT_CONFIG = {
  // Sempre mostrar dev tools em desenvolvimento
  SHOW_DEV_TOOLS: true,
  
  // Habilitar insights XAI
  ENABLE_XAI_INSIGHTS: true,
  
  // Logging verboso
  VERBOSE_LOGGING: isDevelopment,
  
  // Monitor de performance
  ENABLE_DEV_PERFORMANCE_MONITOR: isDevelopment,
  
  // Debug mode
  DEBUG_MODE: isDevelopment
};

// Log de configuração
console.log('🔧 Development Config:', {
  isDevelopment,
  showDevTools: DEVELOPMENT_CONFIG.SHOW_DEV_TOOLS,
  environment: import.meta.env.MODE
});
