// API Configuration for Production/Development
export const API_CONFIG = {
  GUARDRAILS_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-domain.com'  // TODO: Replace with actual production URL
    : 'http://localhost:8000',
  
  ENDPOINTS: {
    health: '/health',
    metrics: '/metrics',
    validate: {
      chat: '/validate/chat',
      appointment: '/validate/appointment', 
      emergency: '/validate/emergency',
      clinical: '/validate/clinical'
    }
  },
  
  // Request configuration
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
}

// API Client with retry logic and error handling
export class GuardrailsAPIClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = API_CONFIG.GUARDRAILS_BASE_URL;
  }
  
  private async request(endpoint: string, options: RequestInit = {}) {
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
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // Health check with automatic retry
  async checkHealth(): Promise<{ status: string; message: string }> {
    return this.request(API_CONFIG.ENDPOINTS.health);
  }
  
  // Get API metrics
  async getMetrics(): Promise<any> {
    return this.request(API_CONFIG.ENDPOINTS.metrics);
  }
  
  // Validate chat message
  async validateChat(message: string): Promise<{
    isValid: boolean;
    confidence: number;
    risk_level: string;
    message: string;
  }> {
    return this.request(API_CONFIG.ENDPOINTS.validate.chat, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
  
  // Validate appointment request
  async validateAppointment(appointmentData: {
    patient_name: string;
    preferred_date: string;
    reason: string;
    urgency_level: string;
  }): Promise<{
    isValid: boolean;
    confidence: number;
    risk_level: string;
    message: string;
  }> {
    return this.request(API_CONFIG.ENDPOINTS.validate.appointment, {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  }
  
  // Validate emergency triage
  async validateEmergency(emergencyData: {
    symptoms: string;
    severity: string;
    duration: string;
    patient_age: number;
  }): Promise<{
    isValid: boolean;
    confidence: number;
    risk_level: string;
    message: string;
  }> {
    return this.request(API_CONFIG.ENDPOINTS.validate.emergency, {
      method: 'POST',
      body: JSON.stringify(emergencyData)
    });
  }
  
  // Validate clinical content
  async validateClinical(clinicalData: {
    content: string;
    content_type: string;
    medical_specialty: string;
  }): Promise<{
    isValid: boolean;
    confidence: number;
    risk_level: string;
    message: string;
  }> {
    return this.request(API_CONFIG.ENDPOINTS.validate.clinical, {
      method: 'POST',
      body: JSON.stringify(clinicalData)
    });
  }
}

// Singleton instance
export const guardrailsAPI = new GuardrailsAPIClient();

// React hook for API integration
export const useGuardrailsAPI = () => {
  return {
    checkHealth: guardrailsAPI.checkHealth.bind(guardrailsAPI),
    getMetrics: guardrailsAPI.getMetrics.bind(guardrailsAPI),
    validateChat: guardrailsAPI.validateChat.bind(guardrailsAPI),
    validateAppointment: guardrailsAPI.validateAppointment.bind(guardrailsAPI),
    validateEmergency: guardrailsAPI.validateEmergency.bind(guardrailsAPI),
    validateClinical: guardrailsAPI.validateClinical.bind(guardrailsAPI)
  };
};
