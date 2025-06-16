interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  subscription?: string;
  firstVisit?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  initialize() {
    if (this.isInitialized) return;

    console.log('[Analytics] Initializing analytics service...');
    
    // Track page views
    this.setupPageTracking();
    
    // Track user interactions
    this.setupInteractionTracking();
    
    // Track errors
    this.setupErrorTracking();

    this.isInitialized = true;
    console.log('[Analytics] Analytics service initialized');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupPageTracking() {
    // Track initial page load
    this.track('page_view', {
      page: window.location.pathname,
      referrer: document.referrer,
      title: document.title
    });

    // Track navigation changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      AnalyticsService.instance.track('page_view', {
        page: window.location.pathname,
        title: document.title
      });
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      AnalyticsService.instance.track('page_view', {
        page: window.location.pathname,
        title: document.title
      });
    };

    window.addEventListener('popstate', () => {
      this.track('page_view', {
        page: window.location.pathname,
        title: document.title
      });
    });
  }

  private setupInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        const buttonText = button?.textContent?.trim() || 'Unknown';
        
        this.track('button_click', {
          button_text: buttonText,
          page: window.location.pathname
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formId = form.id || 'unknown_form';
      
      this.track('form_submit', {
        form_id: formId,
        page: window.location.pathname
      });
    });
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.track('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        page: window.location.pathname
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.track('promise_rejection', {
        reason: event.reason?.toString() || 'Unknown promise rejection',
        page: window.location.pathname
      });
    });
  }

  track(event: string, properties?: Record<string, any>) {
    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        session_id: this.sessionId,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      userId: this.userId || undefined,
      timestamp: Date.now()
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventData);
    }

    // Store locally for batch sending
    this.storeEvent(eventData);

    // Send to analytics service (you can replace with your preferred service)
    this.sendToAnalytics(eventData);
  }

  identify(userId: string, properties?: UserProperties) {
    this.userId = userId;
    
    const identifyData = {
      userId,
      properties: {
        ...properties,
        session_id: this.sessionId,
        last_seen: new Date().toISOString()
      }
    };

    console.log('[Analytics] User identified:', identifyData);
    
    // Store user data
    localStorage.setItem('analytics_user', JSON.stringify(identifyData));
  }

  // Track specific app events
  trackAppointmentCreated(appointmentData: any) {
    this.track('appointment_created', {
      clinic: appointmentData.clinic,
      service: appointmentData.service,
      source: appointmentData.source || 'unknown'
    });
  }

  trackAppointmentCancelled(appointmentId: string) {
    this.track('appointment_cancelled', {
      appointment_id: appointmentId
    });
  }

  trackUserRegistration(method: string) {
    this.track('user_registration', {
      method,
      timestamp: Date.now()
    });
  }

  trackUserLogin(method: string) {
    this.track('user_login', {
      method,
      timestamp: Date.now()
    });
  }

  trackFeatureUsed(feature: string, details?: Record<string, any>) {
    this.track('feature_used', {
      feature,
      ...details
    });
  }

  private storeEvent(event: AnalyticsEvent) {
    try {
      const stored = localStorage.getItem('analytics_events') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 100 events to prevent storage bloat
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('[Analytics] Failed to store event:', error);
    }
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // You can replace this with your actual analytics service
      // Examples: Google Analytics, Mixpanel, Amplitude, PostHog, etc.
      
      // For now, we'll store in Supabase analytics_events table
      if (typeof window !== 'undefined') {
        const { supabase } = await import('@/integrations/supabase/client');
        
        await supabase
          .from('analytics_events')
          .insert({
            event_type: event.event,
            user_id: event.userId || null,
            data: event.properties || {}
          });
      }
    } catch (error) {
      console.error('[Analytics] Failed to send event:', error);
    }
  }

  // Send stored events in batch
  async flushEvents() {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (!stored) return;

      const events = JSON.parse(stored);
      if (events.length === 0) return;

      console.log(`[Analytics] Flushing ${events.length} events...`);

      // Send events in batches
      for (const event of events) {
        await this.sendToAnalytics(event);
      }

      // Clear stored events after successful send
      localStorage.removeItem('analytics_events');
      console.log('[Analytics] Events flushed successfully');
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
    }
  }

  // Get analytics data for dashboard
  async getAnalyticsData(timeRange: string = '7d') {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '1d':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return this.processAnalyticsData(data || []);
    } catch (error) {
      console.error('[Analytics] Failed to get analytics data:', error);
      return null;
    }
  }

  private processAnalyticsData(events: any[]) {
    const pageViews = events.filter(e => e.event_type === 'page_view').length;
    const appointments = events.filter(e => e.event_type === 'appointment_created').length;
    const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
    
    const topPages = events
      .filter(e => e.event_type === 'page_view')
      .reduce((acc, event) => {
        const page = event.data?.page || 'unknown';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      pageViews,
      appointments,
      uniqueUsers,
      topPages,
      totalEvents: events.length
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();
