
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private isEnabled: boolean = true;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure component render time
  measureRender(componentName: string, callback: () => void): void {
    if (!this.isEnabled) return;

    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    
    this.metrics.set(`render_${componentName}`, endTime - startTime);
    console.log(`📊 [Performance] ${componentName} render: ${(endTime - startTime).toFixed(2)}ms`);
  }

  // Measure API call performance
  async measureAPI<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return apiCall();

    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      
      this.metrics.set(`api_${apiName}`, endTime - startTime);
      console.log(`🌐 [Performance] API ${apiName}: ${(endTime - startTime).toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ [Performance] API ${apiName} failed after ${(endTime - startTime).toFixed(2)}ms:`, error);
      throw error;
    }
  }

  // Get performance report
  getReport(): Record<string, number> {
    const report: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      report[key] = value;
    });
    return report;
  }

  // Clear metrics
  clear(): void {
    this.metrics.clear();
  }

  // Toggle monitoring
  toggle(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`📊 [Performance] Monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
