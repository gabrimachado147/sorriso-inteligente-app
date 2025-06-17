
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { performanceMonitor } from '@/services/performance/performanceMonitor';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [vitals, setVitals] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0
  });

  useEffect(() => {
    // Only show in development
    if (import.meta.env.DEV) {
      setIsVisible(true);
    }

    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getReport());
    }, 5000);

    // Collect Web Vitals
    const collectVitals = () => {
      if ('web-vitals' in window) {
        // This would require the web-vitals library
        // For now, we'll use Performance API
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        setVitals({
          fcp: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          lcp: navigation.loadEventEnd - navigation.loadEventStart,
          cls: 0, // Would need actual CLS measurement
          fid: 0  // Would need actual FID measurement
        });
      }
    };

    collectVitals();

    return () => clearInterval(interval);
  }, []);

  const getPerformanceLevel = (value: number, thresholds: [number, number]): 'good' | 'fair' | 'poor' => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'fair';
    return 'poor';
  };

  const getVariantColor = (level: 'good' | 'fair' | 'poor') => {
    switch (level) {
      case 'good': return 'default';
      case 'fair': return 'secondary';
      case 'poor': return 'destructive';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      <Card className="border-blue-200 bg-blue-50/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
            <Badge variant="outline" className="bg-blue-100">
              DEV
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Web Vitals */}
          <div>
            <p className="font-semibold mb-1 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Core Web Vitals
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span>FCP:</span>
                <Badge 
                  variant={getVariantColor(getPerformanceLevel(vitals.fcp, [1800, 3000]))}
                  className="text-xs"
                >
                  {vitals.fcp.toFixed(0)}ms
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>LCP:</span>
                <Badge 
                  variant={getVariantColor(getPerformanceLevel(vitals.lcp, [2500, 4000]))}
                  className="text-xs"
                >
                  {vitals.lcp.toFixed(0)}ms
                </Badge>
              </div>
            </div>
          </div>

          {/* Runtime Metrics */}
          <div>
            <p className="font-semibold mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Runtime Metrics
            </p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {Object.entries(metrics).slice(-5).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="truncate">{key.replace(/_/g, ' ')}:</span>
                  <Badge variant="outline" className="text-xs">
                    {value.toFixed(1)}ms
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Usage (if available) */}
          {(performance as any).memory && (
            <div>
              <p className="font-semibold mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Memory
              </p>
              <div className="flex justify-between">
                <span>Used:</span>
                <Badge variant="outline" className="text-xs">
                  {((performance as any).memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB
                </Badge>
              </div>
            </div>
          )}

          <Button
            onClick={() => performanceMonitor.clear()}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            Clear Metrics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
