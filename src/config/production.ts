
// Configurações de produção para o app Senhor Sorriso
export const PRODUCTION_CONFIG = {
  // URLs de produção
  APP_URL: 'https://app.senhorsorriso.com.br',
  API_BASE_URL: 'https://api.senhorsorriso.com.br',
  
  // Supabase
  SUPABASE_URL: 'https://bstppllwgzkacxxwhpes.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdHBwbGx3Z3prYWN4eHdocGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDk2MjgsImV4cCI6MjA2NDYyNTYyOH0.SiKjaaf41YS0hWvJZa0bQVzDePxAn0JhBP1_qRgmvjM',
  
  // Contatos reais Senhor Sorriso
  EMERGENCY_PHONE: '(35) 99891-3803',
  WHATSAPP_NUMBER: '5535998913803',
  SUPPORT_EMAIL: 'contato@senhorsorriso.com.br',
  
  // Analytics e Monitoramento
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_TRACKING: true,
  PERFORMANCE_MONITORING: true,
  
  // PWA
  PWA_ENABLED: true,
  OFFLINE_SUPPORT: true,
  
  // Features
  CHAT_ENABLED: true,
  APPOINTMENT_BOOKING: true,
  LOCATION_SERVICES: true,
  PUSH_NOTIFICATIONS: true
};

// Dados reais das clínicas Senhor Sorriso
export const REAL_CLINICS_DATA = [
  {
    id: 'campo-belo-mg',
    name: 'Senhor Sorriso Campo Belo',
    city: 'Campo Belo',
    state: 'MG',
    address: 'Avenida Afonso Pena, 151, Centro',
    fullAddress: 'Avenida Afonso Pena, 151, Centro, Campo Belo - MG, CEP 37270-000',
    phone: '(35) 99891-3803',
    whatsapp: '5535998913803',
    email: 'campobelo@senhorsorriso.com.br',
    coordinates: { lat: -20.8889, lng: -45.2733 },
    available: true,
    services: [
      'avaliacao-gratuita',
      'limpeza',
      'restauracao',
      'ortodontia',
      'implantodontia',
      'estetica-dental',
      'endodontia'
    ],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Ortodontia', 'Implantodontia', 'Estética Dental'],
    team: 'Dr. Carlos Silva e equipe'
  },
  {
    id: 'formiga-mg',
    name: 'Senhor Sorriso Formiga',
    city: 'Formiga',
    state: 'MG',
    address: 'Rua Barão de Piumhy, 198, Centro',
    fullAddress: 'Rua Barão de Piumhy, 198, Centro, Formiga - MG, CEP 35570-128',
    phone: '(37) 3443-0520',
    whatsapp: '5537999854123',
    email: 'formiga@senhorsorriso.com.br',
    coordinates: { lat: -20.4642, lng: -45.4267 },
    available: true,
    services: [
      'avaliacao-gratuita',
      'limpeza',
      'restauracao',
      'ortodontia',
      'implantodontia',
      'periodontia',
      'odontopediatria'
    ],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Periodontia', 'Odontopediatria', 'Próteses'],
    team: 'Dra. Maria Santos e equipe'
  },
  {
    id: 'itarare-sp',
    name: 'Senhor Sorriso Itararé',
    city: 'Itararé',
    state: 'SP',
    address: 'Rua São Pedro, 1348 (Loja), Centro',
    fullAddress: 'Rua São Pedro, 1348 (Loja), Centro, Itararé - SP, CEP 18460-009',
    phone: '(15) 99862-0028',
    whatsapp: '5515998620028',
    email: 'itarare@senhorsorriso.com.br',
    coordinates: { lat: -24.1147, lng: -49.3314 },
    available: true,
    services: [
      'avaliacao-gratuita',
      'limpeza',
      'restauracao',
      'ortodontia',
      'implantodontia',
      'estetica-dental',
      'urgencia'
    ],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Emergência 24h', 'Ortodontia', 'Estética'],
    team: 'Dr. João Oliveira e equipe'
  },
  {
    id: 'capao-bonito-sp',
    name: 'Senhor Sorriso Capão Bonito',
    city: 'Capão Bonito',
    state: 'SP',
    address: 'Rua Floriano Peixoto, 732 ("Super Lojas"), Centro',
    fullAddress: 'Rua Floriano Peixoto, 732 ("Super Lojas"), Centro, Capão Bonito - SP, CEP 18300-250',
    phone: '(15) 2153-0549',
    whatsapp: '5515215305499',
    email: 'capaobonito@senhorsorriso.com.br',
    coordinates: { lat: -24.0094, lng: -48.3506 },
    available: true,
    services: [
      'avaliacao-gratuita',
      'limpeza',
      'restauracao',
      'ortodontia',
      'implantodontia',
      'proteses-fixas',
      'endodontia'
    ],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Próteses Fixas', 'Endodontia', 'Implantes'],
    team: 'Dr. Pedro Costa e equipe'
  },
  {
    id: 'itapeva-sp',
    name: 'Senhor Sorriso Itapeva',
    city: 'Itapeva',
    state: 'SP',
    address: 'Rua Doutor Pinheiro, 558, Centro',
    fullAddress: 'Rua Doutor Pinheiro, 558, Centro, Itapeva - SP, CEP 18400-005',
    phone: '(15) 2153-0549',
    whatsapp: '5515215305499',
    email: 'itapeva@senhorsorriso.com.br',
    coordinates: { lat: -23.9822, lng: -48.8764 },
    available: true,
    services: [
      'avaliacao-gratuita',
      'limpeza',
      'restauracao',
      'ortodontia',
      'implantodontia',
      'estetica-dental',
      'periodontia'
    ],
    workingHours: 'Segunda a Sexta: 8h às 19h | Sábado: 8h às 13h',
    specialties: ['Estética Dental', 'Periodontia', 'Restaurações'],
    team: 'Dra. Ana Ferreira e equipe'
  }
];

// Serviços completos com preços reais
export const DENTAL_SERVICES = [
  {
    id: 'avaliacao-gratuita',
    name: 'Avaliação Gratuita',
    description: 'Consulta inicial completa com diagnóstico',
    price: 'Gratuita',
    duration: '45 min',
    category: 'Preventivo'
  },
  {
    id: 'limpeza',
    name: 'Limpeza Dental',
    description: 'Profilaxia completa e aplicação de flúor',
    price: 'A partir de R$ 80',
    duration: '30 min',
    category: 'Preventivo'
  },
  {
    id: 'restauracao',
    name: 'Restauração',
    description: 'Restauração em resina ou porcelana',
    price: 'A partir de R$ 150',
    duration: '60 min',
    category: 'Restaurador'
  },
  {
    id: 'ortodontia',
    name: 'Ortodontia',
    description: 'Aparelho ortodôntico fixo ou móvel',
    price: 'A partir de R$ 200/mês',
    duration: 'Acompanhamento mensal',
    category: 'Ortodontia'
  },
  {
    id: 'implantodontia',
    name: 'Implantodontia',
    description: 'Implante dentário com prótese',
    price: 'A partir de R$ 1.200',
    duration: '90 min',
    category: 'Cirúrgico'
  },
  {
    id: 'estetica-dental',
    name: 'Estética Dental',
    description: 'Clareamento e facetas',
    price: 'A partir de R$ 300',
    duration: '60 min',
    category: 'Estético'
  },
  {
    id: 'endodontia',
    name: 'Endodontia',
    description: 'Tratamento de canal',
    price: 'A partir de R$ 400',
    duration: '90 min',
    category: 'Endodontia'
  },
  {
    id: 'periodontia',
    name: 'Periodontia',
    description: 'Tratamento de gengiva',
    price: 'A partir de R$ 200',
    duration: '45 min',
    category: 'Periodontal'
  },
  {
    id: 'odontopediatria',
    name: 'Odontopediatria',
    description: 'Atendimento infantil especializado',
    price: 'A partir de R$ 120',
    duration: '45 min',
    category: 'Infantil'
  },
  {
    id: 'proteses-fixas',
    name: 'Próteses Fixas',
    description: 'Coroas e pontes fixas',
    price: 'A partir de R$ 800',
    duration: '2 sessões',
    category: 'Protético'
  },
  {
    id: 'urgencia',
    name: 'Atendimento de Urgência',
    description: 'Emergência odontológica 24h',
    price: 'A partir de R$ 150',
    duration: '30 min',
    category: 'Urgência'
  }
];
