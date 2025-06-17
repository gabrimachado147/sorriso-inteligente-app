
export const PRODUCTION_CONFIG = {
  // Performance monitoring
  PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
  ENABLE_ANALYTICS: true,
  
  // PWA settings
  PWA_ENABLED: true,
  OFFLINE_SUPPORT: true,
  PUSH_NOTIFICATIONS: true,
  
  // Security settings
  ENABLE_CSP: true,
  SECURE_HEADERS: true,
  RATE_LIMITING: true,
  
  // Feature flags
  ENABLE_REAL_TIME: true,
  ENABLE_CACHING: true,
  LAZY_LOADING: true,
  
  // API settings
  API_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  
  // UI settings
  ANIMATIONS_ENABLED: true,
  ACCESSIBILITY_FEATURES: true,
  
  // Logging
  LOG_LEVEL: 'info' as 'debug' | 'info' | 'warn' | 'error',
  ENABLE_CONSOLE_LOGS: false,
  
  // Cache settings
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

// Environment-specific overrides
if (import.meta.env.DEV) {
  Object.assign(PRODUCTION_CONFIG, {
    ENABLE_CONSOLE_LOGS: true,
    LOG_LEVEL: 'debug',
    PERFORMANCE_MONITORING: true,
  });
}
