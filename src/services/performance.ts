
// Monitoramento de performance em tempo real
import { PRODUCTION_CONFIG } from '@/config/production';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  url: string;
  additionalData?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 200;

  constructor() {
    if (PRODUCTION_CONFIG.PERFORMANCE_MONITORING) {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    // Monitorar Web Vitals
    this.measureWebVitals();
    
    // Monitorar navegação
    this.measureNavigation();
    
    // Monitorar recursos
    this.measureResources();
  }

  private measureWebVitals() {
    // Cumulative Layout Shift (CLS)
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      }
      this.recordMetric('CLS', cls);
    }).observe({ type: 'layout-shift', buffered: true });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('FID', (entry as any).processingStart - entry.startTime);
      }
    }).observe({ type: 'first-input', buffered: true });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private measureNavigation() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Usar propriedades corretas da PerformanceNavigationTiming
        this.recordMetric('DOM_CONTENT_LOADED', navigation.domContentLoadedEventEnd - navigation.fetchStart);
        this.recordMetric('LOAD_COMPLETE', navigation.loadEventEnd - navigation.fetchStart);
        this.recordMetric('DNS_LOOKUP', navigation.domainLookupEnd - navigation.domainLookupStart);
        this.recordMetric('TCP_CONNECTION', navigation.connectEnd - navigation.connectStart);
        this.recordMetric('SERVER_RESPONSE', navigation.responseEnd - navigation.requestStart);
      }, 0);
    });
  }

  private measureResources() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Monitorar apenas recursos importantes
        if (resource.name.includes('.js') || resource.name.includes('.css') || resource.name.includes('.png')) {
          this.recordMetric('RESOURCE_LOAD', resource.duration, {
            resourceName: resource.name,
            resourceType: this.getResourceType(resource.name),
            transferSize: resource.transferSize
          });
        }
      }
    }).observe({ type: 'resource', buffered: true });
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp')) return 'image';
    return 'other';
  }

  private recordMetric(name: string, value: number, additionalData?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      url: window.location.href,
      additionalData
    };

    this.metrics.unshift(metric);
    
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(0, this.maxMetrics);
    }

    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`Performance: ${name} = ${value.toFixed(2)}ms`, additionalData);
    }

    // Alertar sobre métricas ruins
    this.checkPerformanceThresholds(metric);
  }

  private checkPerformanceThresholds(metric: PerformanceMetric) {
    const thresholds = {
      'LCP': 2500, // 2.5s
      'FID': 100,  // 100ms
      'CLS': 0.1,  // 0.1
      'DOM_CONTENT_LOADED': 1500, // 1.5s
      'LOAD_COMPLETE': 3000 // 3s
    };

    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (threshold && metric.value > threshold) {
      console.warn(`Performance warning: ${metric.name} (${metric.value.toFixed(2)}) exceeds threshold (${threshold})`);
      
      // Em produção, você pode enviar alertas
      if (PRODUCTION_CONFIG.ENABLE_ANALYTICS) {
        this.sendPerformanceAlert(metric, threshold);
      }
    }
  }

  private sendPerformanceAlert(metric: PerformanceMetric, threshold: number) {
    // Enviar alerta para monitoramento
    const alert = {
      type: 'performance_threshold_exceeded',
      metric: metric.name,
      value: metric.value,
      threshold,
      url: metric.url,
      timestamp: metric.timestamp,
      userAgent: navigator.userAgent
    };

    // Armazenar localmente para análise
    const alerts = JSON.parse(localStorage.getItem('performance_alerts') || '[]');
    alerts.unshift(alert);
    
    if (alerts.length > 50) {
      alerts.splice(50);
    }
    
    localStorage.setItem('performance_alerts', JSON.stringify(alerts));
  }

  // Método para medir performance customizada
  measureCustom(name: string, startTime: number, additionalData?: Record<string, any>) {
    const duration = performance.now() - startTime;
    this.recordMetric(name, duration, additionalData);
    return duration;
  }

  // Obter métricas recentes
  getMetrics(name?: string, limit = 20): PerformanceMetric[] {
    let filtered = this.metrics;
    
    if (name) {
      filtered = this.metrics.filter(m => m.name === name);
    }
    
    return filtered.slice(0, limit);
  }

  // Obter resumo de performance
  getPerformanceSummary() {
    const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const metric of this.metrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = { avg: 0, min: Infinity, max: 0, count: 0 };
      }
      
      const s = summary[metric.name];
      s.count++;
      s.min = Math.min(s.min, metric.value);
      s.max = Math.max(s.max, metric.value);
      s.avg = (s.avg * (s.count - 1) + metric.value) / s.count;
    }
    
    return summary;
  }
}

// Instância singleton
export const performanceMonitor = new PerformanceMonitor();

// Hook para componentes React
export const usePerformanceTracking = () => {
  const startMeasurement = (name: string) => {
    const startTime = performance.now();
    return {
      end: (additionalData?: Record<string, any>) => {
        return performanceMonitor.measureCustom(name, startTime, additionalData);
      }
    };
  };

  return {
    startMeasurement,
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getSummary: performanceMonitor.getPerformanceSummary.bind(performanceMonitor)
  };
};
