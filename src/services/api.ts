
// Mock API service para simular integrações futuras
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: 'schedule' | 'call' | 'location';
    label: string;
    data?: unknown;
  }>;
}

export interface AppointmentData {
  serviceId: string;
  clinicId: string;
  date: string;
  time: string;
  userInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  appointments: Array<{
    id: string;
    service: string;
    clinic: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  }>;
}

export interface UserAppointment {
  id: string;
  service: string;
  clinic: string;
  doctor: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados reais das clínicas Senhor Sorriso
const realClinicsData = [
  {
    id: 'campo-belo-mg',
    name: 'Campo Belo - MG',
    city: 'Campo Belo',
    state: 'MG',
    address: 'Avenida Afonso Pena, 151, Centro',
    fullAddress: 'Avenida Afonso Pena, 151, Centro, Campo Belo - MG, CEP 37270-000',
    phone: '(35) 99869-5479',
    whatsapp: '5535998695479',
    email: 'campobelo@senhorsorriso.com.br',
    coordinates: { lat: -20.8889, lng: -45.2733 },
    available: true,
    services: ['Avaliação Gratuita', 'Limpeza Dental', 'Ortodontia', 'Implantodontia', 'Clareamento'],
    workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  },
  {
    id: 'formiga-mg',
    name: 'Formiga - MG',
    city: 'Formiga',
    state: 'MG',
    address: 'Rua Barão de Piumhy, 198, Centro',
    fullAddress: 'Rua Barão de Piumhy, 198, Centro, Formiga - MG, CEP 35570-128',
    phone: '(35) 9969-5479',
    whatsapp: '5535996954799',
    email: 'formiga@senhorsorriso.com.br',
    coordinates: { lat: -20.4642, lng: -45.4267 },
    available: true,
    services: ['Avaliação Gratuita', 'Limpeza Dental', 'Ortodontia', 'Implantodontia', 'Clareamento'],
    workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  },
  {
    id: 'itarare-sp',
    name: 'Itararé - SP',
    city: 'Itararé',
    state: 'SP',
    address: 'Rua São Pedro, 1348 (Loja), Centro',
    fullAddress: 'Rua São Pedro, 1348 (Loja), Centro, Itararé - SP, CEP 18460-009',
    phone: '(35) 99969-5479',
    whatsapp: '5535999695479',
    email: 'itarare@senhorsorriso.com.br',
    coordinates: { lat: -24.1147, lng: -49.3314 },
    available: true,
    services: ['Avaliação Gratuita', 'Limpeza Dental', 'Ortodontia', 'Implantodontia', 'Clareamento'],
    workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  },
  {
    id: 'capao-bonito-sp',
    name: 'Capão Bonito - SP',
    city: 'Capão Bonito',
    state: 'SP',
    address: 'Rua Floriano Peixoto, 732 ("Super Lojas"), Centro',
    fullAddress: 'Rua Floriano Peixoto, 732 ("Super Lojas"), Centro, Capão Bonito - SP, CEP 18300-250',
    phone: '(15) 2153-0549',
    whatsapp: '5515215305499',
    email: 'capaobonito@senhorsorriso.com.br',
    coordinates: { lat: -24.0094, lng: -48.3506 },
    available: true,
    services: ['Avaliação Gratuita', 'Limpeza Dental', 'Ortodontia', 'Implantodontia', 'Clareamento'],
    workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  },
  {
    id: 'itapeva-sp',
    name: 'Itapeva - SP',
    city: 'Itapeva',
    state: 'SP',
    address: 'Rua Doutor Pinheiro, 558, Centro',
    fullAddress: 'Rua Doutor Pinheiro, 558, Centro, Itapeva - SP, CEP 18400-005',
    phone: '(15) 2153-0549',
    whatsapp: '5515215305499',
    email: 'itapeva@senhorsorriso.com.br',
    coordinates: { lat: -23.9822, lng: -48.8764 },
    available: true,
    services: ['Avaliação Gratuita', 'Limpeza Dental', 'Ortodontia', 'Implantodontia', 'Clareamento'],
    workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h'
  }
];

export const apiService = {
  chat: {
    sendMessage: async (message: string, sessionId: string): Promise<ChatMessage> => {
      await delay(1000 + Math.random() * 1000); // 1-2 segundos
      
      let response = '';
      let actions: Array<{type: 'schedule' | 'call' | 'location'; label: string}> = [];

      if (message.toLowerCase().includes('agendar') || message.toLowerCase().includes('consulta')) {
        response = 'Perfeito! Nossa avaliação é totalmente gratuita. Qual especialidade você precisa e em qual cidade?';
        actions = [
          { type: 'schedule', label: 'Ver horários disponíveis' },
          { type: 'location', label: 'Escolher clínica' }
        ];
      } else if (message.toLowerCase().includes('preço') || message.toLowerCase().includes('custo')) {
        response = 'A avaliação inicial é 100% gratuita! Oferecemos também planos de financiamento para todos os tratamentos. Gostaria de agendar sua avaliação?';
        actions = [
          { type: 'schedule', label: 'Agendar avaliação gratuita' }
        ];
      } else if (message.toLowerCase().includes('urgência') || message.toLowerCase().includes('dor')) {
        response = 'Entendo que é uma urgência! Temos horários especiais para casos urgentes. Vou verificar a disponibilidade mais próxima para você.';
        actions = [
          { type: 'call', label: 'Ligar agora para urgência' },
          { type: 'schedule', label: 'Agendar urgência' }
        ];
      } else {
        response = 'Entendi! Posso ajudá-lo com informações sobre nossos serviços, agendamentos ou qualquer dúvida. O que você gostaria de saber?';
        actions = [
          { type: 'schedule', label: 'Agendar consulta' },
          { type: 'location', label: 'Ver clínicas próximas' }
        ];
      }

      return {
        id: Date.now().toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        actions
      };
    },

    getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
      await delay(500);
      return [
        {
          id: '1',
          type: 'bot',
          content: 'Olá! Bem-vindo à Senhor Sorriso! 😊 Como posso ajudá-lo hoje?',
          timestamp: new Date(),
          actions: [
            { type: 'schedule', label: 'Agendar consulta' },
            { type: 'call', label: 'Falar com atendente' },
            { type: 'location', label: 'Ver clínicas' }
          ]
        }
      ];
    }
  },

  appointments: {
    schedule: async (data: AppointmentData): Promise<{appointmentId: string; confirmation: string; whatsappSent: boolean}> => {
      await delay(2000); // Simula processamento
      
      // Simula 90% de sucesso
      if (Math.random() > 0.1) {
        const clinic = realClinicsData.find(c => c.id === data.clinicId);
        return {
          appointmentId: `apt_${Date.now()}`,
          confirmation: `Agendamento confirmado para ${data.date} às ${data.time} na unidade ${clinic?.name || 'Selecionada'}`,
          whatsappSent: true
        };
      } else {
        throw new Error('Horário não disponível. Tente outro horário.');
      }
    },

    getAvailable: async (clinicId: string, date: string): Promise<string[]> => {
      await delay(800);
      
      // Simula horários disponíveis
      const baseSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      return baseSlots.filter(() => Math.random() > 0.3); // Remove alguns aleatoriamente
    },

    getUserAppointments: async (userId: string): Promise<UserAppointment[]> => {
      await delay(600);
      return [
        {
          id: '1',
          service: 'Limpeza Dental',
          clinic: 'Campo Belo - MG',
          doctor: 'Dr. Silva',
          date: '2024-06-15',
          time: '14:00',
          status: 'confirmed'
        }
      ];
    }
  },

  user: {
    getProfile: async (): Promise<UserProfile> => {
      await delay(500);
      return {
        id: 'user_123',
        name: 'João Silva',
        phone: '(11) 99999-9999',
        email: 'joao@email.com',
        appointments: [
          {
            id: '1',
            service: 'Limpeza Dental',
            clinic: 'Centro',
            date: '2024-06-15',
            time: '14:00',
            status: 'confirmed'
          }
        ]
      };
    },

    updateProfile: async (data: Partial<UserProfile>): Promise<{success: boolean}> => {
      await delay(1000);
      return { success: true };
    }
  },

  clinics: {
    getAll: async (): Promise<typeof realClinicsData> => {
      await delay(400);
      return realClinicsData;
    },

    getById: async (id: string) => {
      await delay(300);
      return realClinicsData.find(clinic => clinic.id === id);
    },

    getNearby: async (lat: number, lng: number, radius: number = 50) => {
      await delay(500);
      // Simula busca por proximidade (implementação simples)
      return realClinicsData.filter(clinic => {
        const distance = Math.sqrt(
          Math.pow(clinic.coordinates.lat - lat, 2) + 
          Math.pow(clinic.coordinates.lng - lng, 2)
        );
        return distance <= radius;
      });
    }
  }
};
