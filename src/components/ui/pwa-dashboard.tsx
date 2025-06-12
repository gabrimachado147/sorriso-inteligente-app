import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePWA } from '@/hooks/usePWA';
import { useNotifications } from '@/services/notifications';
import { animations } from '@/lib/animations';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Check,
  X,
  Zap,
  Bell,
  BellOff,
  Share,
  Monitor,
  Settings,
  Activity
} from 'lucide-react';

interface PWADashboardProps {
  onInstall?: () => void;
}

export const PWADashboard: React.FC<PWADashboardProps> = ({ onInstall }) => {
  const { 
    isInstallable, 
    isInstalled, 
    isStandalone, 
    isOnline, 
    installApp, 
    checkForUpdates 
  } = usePWA();
  
  const { requestPermission } = useNotifications();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [installPromptShown, setInstallPromptShown] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    cacheHits: number;
    networkRequests: number;
    offlineTime: number;
  }>({
    cacheHits: 0,
    networkRequests: 0,
    offlineTime: 0
  });

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Monitor performance metrics
    const updateMetrics = () => {
      // This would be connected to actual service worker metrics
      setPerformanceMetrics(prev => ({
        cacheHits: prev.cacheHits + Math.floor(Math.random() * 5),
        networkRequests: prev.networkRequests + Math.floor(Math.random() * 3),
        offlineTime: !isOnline ? prev.offlineTime + 1 : prev.offlineTime
      }));
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleInstall = async () => {
    try {
      await installApp();
      setInstallPromptShown(true);
      onInstall?.();
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await checkForUpdates();
      setTimeout(() => setIsUpdating(false), 1000);
    } catch (error) {
      console.error('Update check failed:', error);
      setIsUpdating(false);
    }
  };

  const handleNotificationPermission = async () => {
    const permission = await requestPermission();
    setNotificationPermission(permission);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sorriso Inteligente',
          text: 'Agende sua consulta odontológica de forma fácil e rápida!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // If running in standalone mode, show minimal dashboard
  if (isStandalone) {
    return (
      <Card className={`${animations.fadeIn} border-green-200 bg-green-50`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Check className="h-4 w-4" />
            <span className="font-medium">App Instalado e Ativo</span>
            <Badge variant="outline" className="ml-auto">
              PWA
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${animations.slideInBottom} border-primary/20`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="h-5 w-5 text-primary" />
          PWA Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-2">
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className="flex items-center gap-1 justify-center p-2"
          >
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          
          <Badge 
            variant={isInstalled ? "default" : "secondary"}
            className="flex items-center gap-1 justify-center p-2"
          >
            {isInstalled ? <Check className="h-3 w-3" /> : <Download className="h-3 w-3" />}
            {isInstalled ? 'Instalado' : 'Web'}
          </Badge>
          
          <Badge 
            variant={notificationPermission === 'granted' ? "default" : "secondary"}
            className="flex items-center gap-1 justify-center p-2"
          >
            {notificationPermission === 'granted' ? <Bell className="h-3 w-3" /> : <BellOff className="h-3 w-3" />}
            Notificações
          </Badge>

          <Badge variant="outline" className="flex items-center gap-1 justify-center p-2">
            <Zap className="h-3 w-3 text-yellow-500" />
            PWA Ready
          </Badge>
        </div>

        <Separator />

        {/* Performance Metrics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-medium">{performanceMetrics.cacheHits}</div>
              <div className="text-gray-500">Cache Hits</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-medium">{performanceMetrics.networkRequests}</div>
              <div className="text-gray-500">Network</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-medium">{Math.floor(performanceMetrics.offlineTime / 60)}m</div>
              <div className="text-gray-500">Offline</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          {/* Install App */}
          {isInstallable && !isInstalled && (
            <Button 
              onClick={handleInstall}
              className={`w-full ${animations.buttonHover}`}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar App
            </Button>
          )}

          {/* Enable Notifications */}
          {notificationPermission !== 'granted' && (
            <Button 
              onClick={handleNotificationPermission}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Ativar Notificações
            </Button>
          )}

          {/* Update Check */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`w-full ${animations.buttonHover}`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Verificando...' : 'Verificar Atualizações'}
          </Button>

          {/* Share App */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="w-full"
          >
            <Share className="h-4 w-4 mr-2" />
            Compartilhar App
          </Button>
        </div>

        {/* Offline Mode Alert */}
        {!isOnline && (
          <div className={`${animations.fadeIn} bg-amber-50 border border-amber-200 rounded-lg p-3`}>
            <div className="flex items-center gap-2 text-amber-800">
              <WifiOff className="h-4 w-4" />
              <span className="font-medium text-sm">Modo Offline</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              Você está navegando offline. O app sincronizará automaticamente quando a conexão for restabelecida.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Simplified install prompt for specific use cases
export const PWAQuickInstall: React.FC<{ onInstall?: () => void }> = ({ onInstall }) => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) return null;

  const handleInstall = async () => {
    try {
      await installApp();
      onInstall?.();
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  return (
    <div className={`${animations.slideInBottom} fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80`}>
      <Card className="border-primary shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Instalar Sorriso Inteligente</h4>
              <p className="text-xs text-gray-600">
                Instale o app para acesso rápido e funcionamento offline
              </p>
            </div>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setDismissed(true)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="flex-1"
            >
              Instalar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setDismissed(true)}
              className="flex-1"
            >
              Agora não
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
