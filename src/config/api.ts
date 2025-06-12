// API Configuration for Production/Development
// Type definitions for API responses
export interface AppointmentData {
  id?: string;
  patient_name: string;
  date: string;
  time: string;
  reason: string;
  urgency_level: string;
}

export interface PatientData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  medicalHistory?: string[];
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export const API_CONFIG = {
  // Standard REST API endpoints (removed Guardrails dependencies)
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com'  // TODO: Replace with actual production URL
    : 'http://localhost:3000',
  
  ENDPOINTS: {
    appointments: '/api/appointments',
    patients: '/api/patients',
    services: '/api/services',
    health: '/api/health'
  },
  
  // Request configuration
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}

// Standard API Client (without Guardrails validation)
export class APIClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }
  
  private async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // Health check
  async checkHealth(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>(API_CONFIG.ENDPOINTS.health);
  }
  
  // Basic appointment operations
  async createAppointment(appointmentData: AppointmentData): Promise<APIResponse<AppointmentData>> {
    return this.request<APIResponse<AppointmentData>>(API_CONFIG.ENDPOINTS.appointments, {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }
  
  async getAppointments(): Promise<APIResponse<AppointmentData[]>> {
    return this.request<APIResponse<AppointmentData[]>>(API_CONFIG.ENDPOINTS.appointments);
  }
  
  // Basic patient operations
  async createPatient(patientData: PatientData): Promise<APIResponse<PatientData>> {
    return this.request<APIResponse<PatientData>>(API_CONFIG.ENDPOINTS.patients, {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  }
  
  async getPatients(): Promise<APIResponse<PatientData[]>> {
    return this.request<APIResponse<PatientData[]>>(API_CONFIG.ENDPOINTS.patients);
  }
}

// Singleton instance
export const apiClient = new APIClient();

// React hook for API integration (without Guardrails)
export const useAPI = () => {
  return {
    checkHealth: apiClient.checkHealth.bind(apiClient),
    createAppointment: apiClient.createAppointment.bind(apiClient),
    getAppointments: apiClient.getAppointments.bind(apiClient),
    createPatient: apiClient.createPatient.bind(apiClient),
    getPatients: apiClient.getPatients.bind(apiClient)
  };
};
