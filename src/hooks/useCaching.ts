
import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, timestamp: Date.now(), expiry });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key) && Date.now() <= this.cache.get(key)!.expiry;
  }
}

const globalCache = new Cache();

interface UseCachingOptions {
  ttl?: number;
  key: string;
}

export const useCaching = <T>({
  ttl = 5 * 60 * 1000,
  key
}: UseCachingOptions) => {
  const [cachedData, setCachedData] = useState<T | null>(() => 
    globalCache.get<T>(key)
  );

  const setCache = useCallback((data: T) => {
    globalCache.set(key, data, ttl);
    setCachedData(data);
  }, [key, ttl]);

  const clearCache = useCallback(() => {
    globalCache.delete(key);
    setCachedData(null);
  }, [key]);

  const hasCache = useCallback(() => {
    return globalCache.has(key);
  }, [key]);

  useEffect(() => {
    const cached = globalCache.get<T>(key);
    if (cached) {
      setCachedData(cached);
    }
  }, [key]);

  return {
    cachedData,
    setCache,
    clearCache,
    hasCache
  };
};
