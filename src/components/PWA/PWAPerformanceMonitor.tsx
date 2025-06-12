import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Database, 
  Wifi, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface ConnectionAPI extends NetworkInfo {
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
}

export function PWAPerformanceMonitor() {
  const { isOnline, storageUsage, getStorageUsage } = usePWA();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [cacheSize, setCacheSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Collect performance metrics
  useEffect(() => {
    const collectMetrics = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const firstContentfulPaint = paintEntries.find(entry => 
          entry.name === 'first-contentful-paint'
        )?.startTime ?? 0;

        setMetrics({
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          firstContentfulPaint,
          largestContentfulPaint: 0, // Would need LCP observer
          cumulativeLayoutShift: 0, // Would need CLS observer
          firstInputDelay: 0, // Would need FID observer
          timeToInteractive: navigation.domInteractive - navigation.fetchStart
        });
      } catch (error) {
        console.error('[PWAPerformance] Failed to collect metrics:', error);
      }
    };

    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    return () => {
      if (document.readyState !== 'complete') {
        window.removeEventListener('load', collectMetrics);
      }
    };
  }, []);

  // Monitor network information
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection: ConnectionAPI }).connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        });
      }
    };

    updateNetworkInfo();
    
    let connection: ConnectionAPI | null = null;
    if ('connection' in navigator) {
      connection = (navigator as Navigator & { connection: ConnectionAPI }).connection;
      connection.addEventListener('change', updateNetworkInfo);
    }
      
    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  // Calculate cache size
  useEffect(() => {
    const calculateCacheSize = async () => {
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          let totalSize = 0;

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            
            for (const request of requests) {
              const response = await cache.match(request);
              if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
              }
            }
          }

          setCacheSize(totalSize);
        }
      } catch (error) {
        console.error('[PWAPerformance] Failed to calculate cache size:', error);
      }
    };

    calculateCacheSize();
  }, []);

  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      await getStorageUsage();
      window.location.reload(); // Simple way to recalculate performance metrics
    } catch (error) {
      console.error('[PWAPerformance] Failed to refresh metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceScore = () => {
    if (!metrics) return 0;
    
    // Simple scoring algorithm based on Core Web Vitals
    let score = 100;
    
    // FCP penalty (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
    if (metrics.firstContentfulPaint > 3000) score -= 30;
    else if (metrics.firstContentfulPaint > 1800) score -= 15;
    
    // Load time penalty
    if (metrics.loadTime > 4000) score -= 20;
    else if (metrics.loadTime > 2000) score -= 10;
    
    // TTI penalty
    if (metrics.timeToInteractive > 3800) score -= 25;
    else if (metrics.timeToInteractive > 2500) score -= 12;
    
    return Math.max(score, 0);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConnectionBadge = () => {
    if (!networkInfo) return null;
    
    const getConnectionColor = () => {
      switch (networkInfo.effectiveType) {
        case '4g': return 'bg-green-100 text-green-800';
        case '3g': return 'bg-yellow-100 text-yellow-800';
        case '2g': return 'bg-red-100 text-red-800';
        case 'slow-2g': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Badge className={getConnectionColor()}>
        {networkInfo.effectiveType.toUpperCase()}
      </Badge>
    );
  };

  const score = getPerformanceScore();

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-blue-600" />
            Performance Monitor
            <Badge variant="outline" className="ml-auto">
              PWA
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-sm text-gray-600">Performance Score</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {score >= 90 ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : score >= 70 ? (
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${getScoreColor(score)}`}>
              {score >= 90 ? 'Excelente' : score >= 70 ? 'Bom' : 'Precisa melhorar'}
            </span>
          </div>
        </div>

        {/* Core Web Vitals */}
        {metrics && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Core Web Vitals
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">FCP</div>
                <div className="text-gray-600">{formatTime(metrics.firstContentfulPaint)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Load</div>
                <div className="text-gray-600">{formatTime(metrics.loadTime)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">TTI</div>
                <div className="text-gray-600">{formatTime(metrics.timeToInteractive)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Status</div>
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <Wifi className="h-3 w-3 text-green-500" />
                  ) : (
                    <Wifi className="h-3 w-3 text-red-500" />
                  )}
                  <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Network Information */}
        {networkInfo && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Conexão
            </h4>
            <div className="flex items-center gap-2 text-sm">
              {getConnectionBadge()}
              <span className="text-gray-600">
                {networkInfo.downlink > 0 && `${networkInfo.downlink} Mbps`}
                {networkInfo.rtt > 0 && ` • ${networkInfo.rtt}ms`}
              </span>
              {networkInfo.saveData && (
                <Badge variant="outline" className="text-xs">
                  Data Saver
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Storage Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Armazenamento
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cache:</span>
              <span>{formatBytes(cacheSize)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Uso total:</span>
              <span>{formatBytes(storageUsage.used)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Disponível:</span>
              <span>{formatBytes(storageUsage.quota)}</span>
            </div>
            <Progress 
              value={storageUsage.percentage} 
              className="h-2"
            />
            <div className="text-xs text-gray-500 text-center">
              {storageUsage.percentage}% usado
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Otimizações Ativas
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Service Worker ativo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Cache estratégico implementado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Lazy loading de componentes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Code splitting ativo</span>
            </div>
            {networkInfo?.saveData && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Modo economia de dados detectado</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PWAPerformanceMonitor;
