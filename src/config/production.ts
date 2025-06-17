
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

  // App URL for health checks
  APP_URL: 'https://senhor-sorriso.com',
} as const;

// Environment-specific overrides
if (import.meta.env.DEV) {
  Object.assign(PRODUCTION_CONFIG, {
    ENABLE_CONSOLE_LOGS: true,
    LOG_LEVEL: 'debug',
    PERFORMANCE_MONITORING: true,
  });
}

// Real clinics data for production
export const REAL_CLINICS_DATA = [
  {
    id: 'clinic-sp-01',
    name: 'Senhor Sorriso São Paulo Centro',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua Augusta, 1234',
    fullAddress: 'Rua Augusta, 1234 - Centro, São Paulo - SP, 01305-100',
    phone: '(11) 3333-4444',
    whatsapp: '5511933334444',
    email: 'saopaulo@senhorsorriso.com',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    available: true,
    services: ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'estetica-dental', 'implantes'],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Ortodontia', 'Estética Dental', 'Implantodontia'],
    team: 'Dr. João Silva, Dra. Maria Santos'
  },
  {
    id: 'clinic-rj-01',
    name: 'Senhor Sorriso Rio de Janeiro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Av. Copacabana, 567',
    fullAddress: 'Av. Copacabana, 567 - Copacabana, Rio de Janeiro - RJ, 22050-000',
    phone: '(21) 2222-3333',
    whatsapp: '5521922223333',
    email: 'riodejaneiro@senhorsorriso.com',
    coordinates: { lat: -22.9068, lng: -43.1729 },
    available: true,
    services: ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'clareamento'],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Ortodontia', 'Clareamento Dental'],
    team: 'Dr. Carlos Oliveira, Dra. Ana Costa'
  },
  {
    id: 'clinic-mg-01',
    name: 'Senhor Sorriso Belo Horizonte',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Rua da Bahia, 890',
    fullAddress: 'Rua da Bahia, 890 - Centro, Belo Horizonte - MG, 30160-011',
    phone: '(31) 3333-4444',
    whatsapp: '5531933334444',
    email: 'belohorizonte@senhorsorriso.com',
    coordinates: { lat: -19.9245, lng: -43.9352 },
    available: true,
    services: ['avaliacao-gratuita', 'limpeza', 'ortodontia', 'restauracao'],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Ortodontia', 'Restauração'],
    team: 'Dr. Pedro Lima, Dra. Carla Mendes'
  }
];

// Dental services data
export const DENTAL_SERVICES = [
  {
    id: 'avaliacao-gratuita',
    name: 'Avaliação Gratuita',
    description: 'Consulta completa com diagnóstico profissional',
    price: 'Gratuito',
    duration: '30 min',
    category: 'Preventivo'
  },
  {
    id: 'limpeza',
    name: 'Limpeza Dental',
    description: 'Profilaxia completa com remoção de tártaro',
    price: 'A partir de R$ 80',
    duration: '45 min',
    category: 'Preventivo'
  },
  {
    id: 'ortodontia',
    name: 'Ortodontia',
    description: 'Aparelho ortodôntico para alinhamento dental',
    price: 'A partir de R$ 150/mês',
    duration: '12-24 meses',
    category: 'Ortodontia'
  },
  {
    id: 'estetica-dental',
    name: 'Estética Dental',
    description: 'Procedimentos estéticos para um sorriso perfeito',
    price: 'A partir de R$ 200',
    duration: '1-2 horas',
    category: 'Estético'
  },
  {
    id: 'implantes',
    name: 'Implantes Dentários',
    description: 'Implantes para substituição de dentes perdidos',
    price: 'A partir de R$ 800',
    duration: '2-3 horas',
    category: 'Cirúrgico'
  },
  {
    id: 'clareamento',
    name: 'Clareamento Dental',
    description: 'Clareamento profissional para dentes mais brancos',
    price: 'A partir de R$ 300',
    duration: '1 hora',
    category: 'Estético'
  },
  {
    id: 'restauracao',
    name: 'Restauração',
    description: 'Restauração de dentes com cáries ou danos',
    price: 'A partir de R$ 120',
    duration: '45 min',
    category: 'Restaurador'
  }
];
