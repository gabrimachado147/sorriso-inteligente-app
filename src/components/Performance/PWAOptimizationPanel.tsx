
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePWAOptimized } from '@/hooks/usePWAOptimized';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Zap, 
  HardDrive, 
  RefreshCw,
  Trash2,
  Sync
} from 'lucide-react';

export const PWAOptimizationPanel = memo(() => {
  const {
    isOnline,
    isInstalled,
    canInstall,
    installPrompt,
    cacheStats,
    performanceMetrics,
    offlineCapabilities,
    optimizePerformance,
    clearCache,
    syncOfflineData
  } = usePWAOptimized();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status da Conexão</CardTitle>
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={isInstalled ? 'default' : 'secondary'}>
              {isInstalled ? 'Instalado' : 'Navegador'}
            </Badge>
            {canInstall && (
              <Button 
                size="sm" 
                onClick={installPrompt || undefined}
                className="flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Instalar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cache Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cache</CardTitle>
          <HardDrive className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cacheStats.size} itens</div>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Taxa de Acerto</span>
              <span>{cacheStats.hitRate.toFixed(1)}%</span>
            </div>
            <Progress value={cacheStats.hitRate} className="h-2" />
            {cacheStats.lastUpdated && (
              <p className="text-xs text-gray-500">
                Atualizado: {cacheStats.lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Zap className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Eficiência do Cache</span>
              <span>{performanceMetrics.cacheEfficiency.toFixed(1)}%</span>
            </div>
            <Progress value={performanceMetrics.cacheEfficiency} className="h-2" />
            
            <div className="text-xs text-gray-500 space-y-1">
              <div>Tempo de Carregamento: {performanceMetrics.loadTime}ms</div>
              <div>Tempo de Renderização: {performanceMetrics.renderTime}ms</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Capabilities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Modo Offline</CardTitle>
          <Sync className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Dados Offline</span>
              <Badge variant={offlineCapabilities.hasOfflineData ? 'default' : 'secondary'}>
                {offlineCapabilities.hasOfflineData ? 'Disponível' : 'Vazio'}
              </Badge>
            </div>
            
            {offlineCapabilities.pendingSyncCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Pendente</span>
                <Badge variant="outline">
                  {offlineCapabilities.pendingSyncCount} itens
                </Badge>
              </div>
            )}
            
            {offlineCapabilities.lastSync && (
              <p className="text-xs text-gray-500">
                Última Sincronização: {offlineCapabilities.lastSync.toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Actions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Ações de Otimização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              onClick={optimizePerformance}
              className="flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              Otimizar Performance
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={clearCache}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Limpar Cache
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={syncOfflineData}
              disabled={!isOnline}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Sincronizar Dados
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>• Otimizar Performance: Remove caches antigos e precarrega recursos críticos</p>
            <p>• Limpar Cache: Remove todos os dados em cache (exceto preferências do usuário)</p>
            <p>• Sincronizar Dados: Envia dados offline pendentes para o servidor</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PWAOptimizationPanel.displayName = 'PWAOptimizationPanel';
