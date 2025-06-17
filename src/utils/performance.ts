
import { performanceMonitor } from '@/services/performance/performanceMonitor';

// Performance utility functions
export const measurePerformance = async <T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.measureAPI(label, fn);
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Lazy loading utility
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '10px',
    threshold: 0.1,
    ...options
  });
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV) {
    console.group('📦 Bundle Analysis');
    
    // Analyze loaded scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script: any) => {
      if (script.src.includes('assets')) {
        console.log(`Script: ${script.src.split('/').pop()}`);
      }
    });
    
    // Analyze loaded stylesheets
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    styles.forEach((style: any) => {
      if (style.href.includes('assets')) {
        console.log(`Stylesheet: ${style.href.split('/').pop()}`);
      }
    });
    
    console.groupEnd();
  }
};
