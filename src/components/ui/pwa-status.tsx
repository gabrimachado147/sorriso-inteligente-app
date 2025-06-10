import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { animations } from '@/lib/animations';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Check,
  X,
  Zap
} from 'lucide-react';

interface PWAStatusProps {
  onInstall?: () => void;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({ onInstall }) => {
  const { 
    isInstallable, 
    isInstalled, 
    isStandalone, 
    isOnline, 
    installApp, 
    checkForUpdates 
  } = usePWA();
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInstall = async () => {
    try {
      await installApp();
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

  // Se já está instalado e rodando standalone, não mostrar
  if (isStandalone) {
    return null;
  }

  return (
    <Card className={`${animations.slideInBottom} border-primary/20`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="h-5 w-5 text-primary" />
          Status do App
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          
          <Badge 
            variant={isInstalled ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isInstalled ? <Check className="h-3 w-3" /> : <Download className="h-3 w-3" />}
            {isInstalled ? 'Instalado' : 'Não Instalado'}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-500" />
            PWA Ativo
          </Badge>
        </div>

        {/* Install Prompt */}
        {isInstallable && !isInstalled && (
          <div className={`${animations.fadeIn} space-y-3`}>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary mb-2">
                📱 Instalar o App
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Instale o Sorriso Inteligente em seu dispositivo para:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-3">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Acesso rápido sem abrir o navegador
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Funcionar offline
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  Notificações de consultas
                </li>
              </ul>
              <Button 
                onClick={handleInstall}
                className={`w-full ${animations.buttonHover}`}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar App
              </Button>
            </div>
          </div>
        )}

        {/* Already Installed */}
        {isInstalled && (
          <div className={`${animations.fadeIn} space-y-2`}>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <Check className="h-4 w-4" />
                <span className="font-medium">App Instalado!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                O Sorriso Inteligente está instalado e pronto para uso.
              </p>
            </div>
          </div>
        )}

        {/* Offline Mode */}
        {!isOnline && (
          <div className={`${animations.fadeIn} space-y-2`}>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <WifiOff className="h-4 w-4" />
                <span className="font-medium">Modo Offline</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Algumas funcionalidades podem estar limitadas.
              </p>
            </div>
          </div>
        )}

        {/* Update Button */}
        <div className="pt-2 border-t">
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
        </div>
      </CardContent>
    </Card>
  );
};

// Componente simplificado para install prompt
export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className={`${animations.slideInBottom} fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80`}>
      <Card className="border-primary shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Instalar App</h4>
              <p className="text-xs text-gray-600">
                Acesso rápido e modo offline
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
              onClick={installApp}
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
