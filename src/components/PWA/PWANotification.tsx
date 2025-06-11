import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

interface PWANotificationProps {
  className?: string;
}

export function PWANotification({ className }: PWANotificationProps) {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    hasUpdate,
    updateAvailable,
    backgroundSyncStatus,
    installApp,
    applyUpdate,
    installMetrics
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);

  // Mostrar prompt de instalação após algum tempo de uso
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000); // 10 segundos

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  // Mostrar prompt de atualização quando disponível
  useEffect(() => {
    if (hasUpdate && updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [hasUpdate, updateAvailable]);

  // Escutar eventos customizados de atualização
  useEffect(() => {
    const handleUpdateAvailable = (event: CustomEvent) => {
      console.log('[PWANotification] Update available:', event.detail);
      setShowUpdatePrompt(true);
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable as EventListener);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    try {
      await installApp();
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('[PWANotification] Install failed:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsApplyingUpdate(true);
      await applyUpdate();
      setShowUpdatePrompt(false);
    } catch (error) {
      console.error('[PWANotification] Update failed:', error);
    } finally {
      setIsApplyingUpdate(false);
    }
  };

  return (
    <div className={cn('fixed top-4 right-4 z-50 space-y-2 max-w-sm', className)}>
      {/* Status de Conectividade */}
      {!isOnline && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-yellow-600" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Você está offline
                </p>
                <p className="text-yellow-600 dark:text-yellow-300">
                  Funcionando no modo offline
                </p>
              </div>
              {backgroundSyncStatus === 'syncing' && (
                <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status de Sincronização */}
      {backgroundSyncStatus === 'syncing' && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Sincronizando dados
                </p>
                <p className="text-blue-600 dark:text-blue-300">
                  Enviando dados offline...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompt de Instalação */}
      {showInstallPrompt && isInstallable && !isInstalled && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 animate-in slide-in-from-right duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm text-green-800 dark:text-green-200">
                  Instalar App
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                onClick={() => setShowInstallPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-green-600 dark:text-green-300">
              Instale o Sorriso Inteligente para acesso rápido e funcionalidades offline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Instalar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstallPrompt(false)}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Agora não
              </Button>
            </div>
            {installMetrics.installPromptShown > 0 && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                <Badge variant="secondary" className="text-xs">
                  {installMetrics.installPromptShown} prompts mostrados
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prompt de Atualização */}
      {showUpdatePrompt && updateAvailable && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 animate-in slide-in-from-right duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm text-blue-800 dark:text-blue-200">
                  Nova Versão Disponível
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                onClick={() => setShowUpdatePrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              Uma nova versão do app está disponível com melhorias e correções
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isApplyingUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isApplyingUpdate ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                {isApplyingUpdate ? 'Atualizando...' : 'Atualizar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpdatePrompt(false)}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                disabled={isApplyingUpdate}
              >
                Depois
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status de Sucesso - Online novamente */}
      {isOnline && backgroundSyncStatus === 'idle' && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 animate-in slide-in-from-right duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-green-600" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-green-800 dark:text-green-200">
                  Conectado novamente
                </p>
                <p className="text-green-600 dark:text-green-300">
                  Todos os dados foram sincronizados
                </p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status de Erro de Sincronização */}
      {backgroundSyncStatus === 'failed' && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-red-800 dark:text-red-200">
                  Erro na sincronização
                </p>
                <p className="text-red-600 dark:text-red-300">
                  Alguns dados podem não ter sido salvos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PWANotification;
