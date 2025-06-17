
// Sistema de monitoramento de erros para produção
import { PRODUCTION_CONFIG } from '@/config/production';

interface ErrorData {
  message: string;
  stack?: string;
  url: string;
  userId?: string;
  timestamp: Date;
  userAgent: string;
  additionalData?: Record<string, any>;
}

class ErrorTracker {
  private errors: ErrorData[] = [];
  private maxErrors = 100;
  
  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Capturar erros JavaScript não tratados
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        additionalData: {
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript_error'
        }
      });
    });

    // Capturar promises rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        additionalData: {
          type: 'promise_rejection',
          reason: event.reason
        }
      });
    });
  }

  logError(error: Partial<ErrorData> & { message: string }) {
    const errorData: ErrorData = {
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      ...error
    };

    // Adicionar à lista local
    this.errors.unshift(errorData);
    
    // Manter apenas os últimos erros
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log no console em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Error tracked:', errorData);
    }

    // Enviar para monitoramento em produção
    if (PRODUCTION_CONFIG.ENABLE_ERROR_TRACKING) {
      this.sendToMonitoring(errorData);
    }
  }

  private async sendToMonitoring(error: ErrorData) {
    try {
      // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
      // Por enquanto, vamos armazenar no localStorage para análise
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      storedErrors.unshift(error);
      
      // Manter apenas os últimos 50 erros no localStorage
      if (storedErrors.length > 50) {
        storedErrors.splice(50);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(storedErrors));
      
      // Em produção real, envie para seu serviço de monitoramento
      // fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) });
      
    } catch (e) {
      console.warn('Failed to send error to monitoring:', e);
    }
  }

  getRecentErrors(limit = 10): ErrorData[] {
    return this.errors.slice(0, limit);
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('app_errors');
  }

  // Método para reportar erros customizados
  reportCustomError(message: string, additionalData?: Record<string, any>) {
    this.logError({
      message,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      additionalData: {
        ...additionalData,
        type: 'custom_error'
      }
    });
  }
}

// Instância singleton
export const errorTracker = new ErrorTracker();

// Hook para componentes React
export const useErrorTracking = () => {
  const reportError = (error: Error, errorInfo?: any) => {
    errorTracker.logError({
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      additionalData: {
        componentStack: errorInfo?.componentStack,
        type: 'react_error'
      }
    });
  };

  return { reportError, getRecentErrors: errorTracker.getRecentErrors.bind(errorTracker) };
};
