
// Configurações específicas para desenvolvimento
export const DEVELOPMENT_CONFIG = {
  // XAI/Grok Integration
  ENABLE_XAI_INSIGHTS: import.meta.env.VITE_ENABLE_XAI === 'true' || import.meta.env.DEV,
  
  // Debug Settings
  VERBOSE_LOGGING: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,
  
  // Development Tools
  SHOW_DEV_TOOLS: import.meta.env.DEV || import.meta.env.VITE_SHOW_DEV_TOOLS === 'true',
  
  // Performance Monitoring in Development
  ENABLE_DEV_PERFORMANCE_MONITOR: import.meta.env.DEV,
  
  // Feature Flags for Development
  ENABLE_EXPERIMENTAL_FEATURES: import.meta.env.VITE_ENABLE_EXPERIMENTAL === 'true',
} as const;

// Environment Detection
export const isDevelopment = import.meta.env.DEV;
export const isStaging = import.meta.env.VITE_ENVIRONMENT === 'staging';
export const isProduction = import.meta.env.VITE_ENVIRONMENT === 'production';

// Development Utilities
export const devLog = (...args: any[]) => {
  if (DEVELOPMENT_CONFIG.VERBOSE_LOGGING) {
    console.log('[DEV]', ...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (DEVELOPMENT_CONFIG.VERBOSE_LOGGING) {
    console.warn('[DEV]', ...args);
  }
};

export const devError = (...args: any[]) => {
  if (DEVELOPMENT_CONFIG.VERBOSE_LOGGING) {
    console.error('[DEV]', ...args);
  }
};
