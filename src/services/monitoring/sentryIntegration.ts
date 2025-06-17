import { errorTracker } from '@/services/errorTracking';
import { PRODUCTION_CONFIG } from '@/config/production';

interface MonitoringEvent {
  type: 'error' | 'performance' | 'user_action' | 'business_metric';
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class MonitoringService {
  private events: MonitoringEvent[] = [];
  private maxEvents = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring() {
    if (PRODUCTION_CONFIG.ENABLE_ANALYTICS) {
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      // Setup user interaction tracking
      this.setupUserInteractionTracking();
      
      // Setup business metrics
      this.setupBusinessMetrics();
    }
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackEvent('performance', {
          metric: entry.name,
          value: entry.startTime,
          entryType: entry.entryType
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'measure', 'mark'] });
    } catch (error) {
      console.warn('Performance Observer not supported');
    }
  }

  private setupUserInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        this.trackEvent('user_action', {
          action: 'click',
          element: target.tagName,
          text: target.textContent?.slice(0, 50),
          className: target.className
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackEvent('user_action', {
        action: 'form_submit',
        formId: form.id,
        formName: form.name
      });
    });
  }

  private setupBusinessMetrics() {
    // Track appointment-related metrics
    window.addEventListener('appointment_created', ((event: CustomEvent) => {
      this.trackEvent('business_metric', {
        metric: 'appointment_created',
        clinic: event.detail.clinic,
        service: event.detail.service,
        source: event.detail.source
      });
    }) as EventListener);

    window.addEventListener('appointment_cancelled', ((event: CustomEvent) => {
      this.trackEvent('business_metric', {
        metric: 'appointment_cancelled',
        reason: event.detail.reason,
        clinic: event.detail.clinic
      });
    }) as EventListener);
  }

  trackEvent(type: MonitoringEvent['type'], data: Record<string, any>, userId?: string) {
    const event: MonitoringEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userId,
      sessionId: this.sessionId
    };

    this.events.unshift(event);
    
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`📊 [Monitoring] ${type}:`, data);
    }

    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      this.sendToMonitoringService(event);
    }
  }

  private async sendToMonitoringService(event: MonitoringEvent) {
    try {
      // Store locally for now, can be sent to external service
      const stored = localStorage.getItem('monitoring_events');
      const events = stored ? JSON.parse(stored) : [];
      events.unshift(event);
      
      // Keep only last 100 events in localStorage
      if (events.length > 100) {
        events.splice(100);
      }
      
      localStorage.setItem('monitoring_events', JSON.stringify(events));
    } catch (error) {
      errorTracker.reportError(error as Error, {
        component: 'MonitoringService',
        action: 'sendToMonitoringService'
      });
    }
  }

  getEvents(type?: MonitoringEvent['type'], limit = 50): MonitoringEvent[] {
    let filtered = this.events;
    
    if (type) {
      filtered = this.events.filter(event => event.type === type);
    }
    
    return filtered.slice(0, limit);
  }

  getBusinessMetrics() {
    const businessEvents = this.getEvents('business_metric');
    
    const metrics = {
      appointments_created: businessEvents.filter(e => e.data.metric === 'appointment_created').length,
      appointments_cancelled: businessEvents.filter(e => e.data.metric === 'appointment_cancelled').length,
      popular_services: this.getPopularServices(businessEvents),
      popular_clinics: this.getPopularClinics(businessEvents)
    };

    return metrics;
  }

  private getPopularServices(events: MonitoringEvent[]) {
    const serviceCount: Record<string, number> = {};
    
    events
      .filter(e => e.data.metric === 'appointment_created')
      .forEach(e => {
        const service = e.data.service;
        serviceCount[service] = (serviceCount[service] || 0) + 1;
      });

    return Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));
  }

  private getPopularClinics(events: MonitoringEvent[]) {
    const clinicCount: Record<string, number> = {};
    
    events
      .filter(e => e.data.metric === 'appointment_created')
      .forEach(e => {
        const clinic = e.data.clinic;
        clinicCount[clinic] = (clinicCount[clinic] || 0) + 1;
      });

    return Object.entries(clinicCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([clinic, count]) => ({ clinic, count }));
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('monitoring_events');
  }
}

export const monitoringService = new MonitoringService();

// Helper functions for business metrics
export const trackAppointmentCreated = (appointmentData: any) => {
  monitoringService.trackEvent('business_metric', {
    metric: 'appointment_created',
    clinic: appointmentData.clinic,
    service: appointmentData.service,
    source: appointmentData.source || 'pwa'
  });

  // Dispatch custom event for other listeners
  window.dispatchEvent(new CustomEvent('appointment_created', {
    detail: appointmentData
  }));
};

export const trackAppointmentCancelled = (appointmentData: any, reason?: string) => {
  monitoringService.trackEvent('business_metric', {
    metric: 'appointment_cancelled',
    clinic: appointmentData.clinic,
    reason: reason || 'user_cancelled'
  });

  window.dispatchEvent(new CustomEvent('appointment_cancelled', {
    detail: { ...appointmentData, reason }
  }));
};
