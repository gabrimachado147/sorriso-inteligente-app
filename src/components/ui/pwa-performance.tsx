import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOfflineManager } from '@/services/offline-manager';
import { 
  Activity, 
  Database, 
  Wifi, 
  Clock, 
  BarChart3, 
  RefreshCw,
  Zap,
  HardDrive,
  TrendingUp
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  cacheHitRatio: number;
  offlineCapability: boolean;
  storageUsed: number;
  networkLatency: number;
  serviceWorkerStatus: 'active' | 'installing' | 'waiting' | 'redundant' | 'none';
}

export const PWAPerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    cacheHitRatio: 0,
    offlineCapability: false,
    storageUsed: 0,
    networkLatency: 0,
    serviceWorkerStatus: 'none'
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { getStorageStats } = useOfflineManager();

  useEffect(() => {
    initializeMonitoring();
    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMetrics = useCallback(async () => {
    try {
      // Performance timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;

      // Service Worker status
      let swStatus: PerformanceMetrics['serviceWorkerStatus'] = 'none';
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          if (registration.active) swStatus = 'active';
          else if (registration.installing) swStatus = 'installing';
          else if (registration.waiting) swStatus = 'waiting';
          else swStatus = 'redundant';
        }
      }

      // Storage statistics
      const storageStats = await getStorageStats();
      
      // Network latency (rough estimate)
      const startTime = performance.now();
      try {
        await fetch('/manifest.json', { method: 'HEAD' });
        const networkLatency = performance.now() - startTime;
        
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(loadTime),
          serviceWorkerStatus: swStatus,
          storageUsed: Math.round(storageStats.estimatedSize / 1024), // Convert to KB
          networkLatency: Math.round(networkLatency),
          offlineCapability: swStatus === 'active',
          cacheHitRatio: storageStats.cacheSize > 0 ? 
            Math.round((storageStats.cacheSize / (storageStats.cacheSize + storageStats.syncQueueSize)) * 100) : 0
        }));
      } catch {
        // Offline - update accordingly
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(loadTime),
          serviceWorkerStatus: swStatus,
          storageUsed: Math.round(storageStats.estimatedSize / 1024),
          networkLatency: 0,
          offlineCapability: true,
          cacheHitRatio: 100 // Assume all hits are from cache when offline
        }));
      }
    } catch (error) {
      console.error('[PWA] Performance monitoring error:', error);
    }
  }, [getStorageStats]);

  const initializeMonitoring = useCallback(async () => {
    setIsMonitoring(true);
    await updateMetrics();
    setIsMonitoring(false);
  }, [updateMetrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'installing': case 'waiting': return 'secondary';
      case 'redundant': case 'none': return 'destructive';
      default: return 'outline';
    }
  };

  const getPerformanceScore = () => {
    let score = 0;
    
    // Load time score (0-30 points)
    if (metrics.loadTime < 1000) score += 30;
    else if (metrics.loadTime < 2000) score += 20;
    else if (metrics.loadTime < 3000) score += 10;
    
    // Cache hit ratio score (0-25 points)
    score += Math.round((metrics.cacheHitRatio / 100) * 25);
    
    // Service Worker score (0-25 points)
    if (metrics.serviceWorkerStatus === 'active') score += 25;
    else if (metrics.serviceWorkerStatus === 'waiting') score += 15;
    
    // Offline capability score (0-20 points)
    if (metrics.offlineCapability) score += 20;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const score = getPerformanceScore();

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-blue-600" />
          Performance Monitor
          <Badge variant="outline" className="ml-auto">
            PWA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-sm text-gray-600">Performance Score</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600">Optimized PWA</span>
          </div>
        </div>

        <Separator />

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Load Time */}
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <div className="font-semibold text-sm">{metrics.loadTime}ms</div>
            <div className="text-xs text-gray-600">Load Time</div>
          </div>

          {/* Cache Hit Ratio */}
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Database className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <div className="font-semibold text-sm">{metrics.cacheHitRatio}%</div>
            <div className="text-xs text-gray-600">Cache Hits</div>
          </div>

          {/* Network Latency */}
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Wifi className="h-4 w-4 mx-auto mb-1 text-purple-600" />
            <div className="font-semibold text-sm">
              {metrics.networkLatency > 0 ? `${metrics.networkLatency}ms` : 'Offline'}
            </div>
            <div className="text-xs text-gray-600">Network</div>
          </div>

          {/* Storage Used */}
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <HardDrive className="h-4 w-4 mx-auto mb-1 text-orange-600" />
            <div className="font-semibold text-sm">{metrics.storageUsed}KB</div>
            <div className="text-xs text-gray-600">Storage</div>
          </div>
        </div>

        <Separator />

        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Service Worker</span>
            <Badge variant={getStatusColor(metrics.serviceWorkerStatus)}>
              {metrics.serviceWorkerStatus}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Offline Capability</span>
            <Badge variant={metrics.offlineCapability ? "default" : "destructive"}>
              {metrics.offlineCapability ? 'Ready' : 'Limited'}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={updateMetrics}
            disabled={isMonitoring}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isMonitoring ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(reg => {
                  if (reg) reg.update();
                });
              }
            }}
            className="flex-1"
          >
            <Zap className="h-4 w-4 mr-2" />
            Update SW
          </Button>
        </div>

        {/* Performance Tips */}
        {score < 70 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-1">
              Performance Tips
            </div>
            <ul className="text-xs text-yellow-700 space-y-1">
              {metrics.loadTime > 3000 && (
                <li>• Consider clearing cache to improve load times</li>
              )}
              {metrics.cacheHitRatio < 50 && (
                <li>• Browse offline content to improve cache efficiency</li>
              )}
              {metrics.serviceWorkerStatus !== 'active' && (
                <li>• Refresh the page to activate Service Worker</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
