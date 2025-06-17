
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Activity, Wifi, Database, Zap, Globe } from 'lucide-react';
import { PRODUCTION_CONFIG } from '@/config/production';
import { errorTracker } from '@/services/errorTracking';
import { performanceMonitor } from '@/services/performance';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  responseTime?: number;
  icon: React.ElementType;
}

export const ProductionHealthCheck: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runHealthChecks = async () => {
    setIsChecking(true);
    const checks: HealthStatus[] = [];

    // 1. Verificar conectividade de rede
    try {
      const start = performance.now();
      const response = await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
      const responseTime = performance.now() - start;
      
      checks.push({
        component: 'Conectividade de Rede',
        status: 'healthy',
        message: 'Conectividade ativa',
        responseTime: Math.round(responseTime),
        icon: Wifi
      });
    } catch (error) {
      checks.push({
        component: 'Conectividade de Rede',
        status: 'error',
        message: 'Sem conectividade',
        icon: Wifi
      });
    }

    // 2. Verificar Supabase
    try {
      const start = performance.now();
      const { data, error } = await supabase.from('clinics').select('count').limit(1);
      const responseTime = performance.now() - start;
      
      if (error) {
        checks.push({
          component: 'Supabase Database',
          status: 'error',
          message: `Erro: ${error.message}`,
          icon: Database
        });
      } else {
        checks.push({
          component: 'Supabase Database',
          status: 'healthy',
          message: 'Conectado e operacional',
          responseTime: Math.round(responseTime),
          icon: Database
        });
      }
    } catch (error) {
      checks.push({
        component: 'Supabase Database',
        status: 'error',
        message: 'Falha na conexão',
        icon: Database
      });
    }

    // 3. Verificar Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.active) {
          checks.push({
            component: 'Service Worker (PWA)',
            status: 'healthy',
            message: 'Ativo e funcionando',
            icon: Activity
          });
        } else {
          checks.push({
            component: 'Service Worker (PWA)',
            status: 'warning',
            message: 'Não ativo',
            icon: Activity
          });
        }
      } catch (error) {
        checks.push({
          component: 'Service Worker (PWA)',
          status: 'error',
          message: 'Erro no SW',
          icon: Activity
        });
      }
    } else {
      checks.push({
        component: 'Service Worker (PWA)',
        status: 'error',
        message: 'Não suportado',
        icon: Activity
      });
    }

    // 4. Verificar Performance
    const performanceSummary = performanceMonitor.getPerformanceSummary();
    const lcpAvg = performanceSummary.LCP?.avg || 0;
    
    if (lcpAvg === 0) {
      checks.push({
        component: 'Performance (LCP)',
        status: 'warning',
        message: 'Sem dados de LCP',
        icon: Zap
      });
    } else if (lcpAvg < 2500) {
      checks.push({
        component: 'Performance (LCP)',
        status: 'healthy',
        message: `LCP: ${lcpAvg.toFixed(0)}ms (Bom)`,
        responseTime: Math.round(lcpAvg),
        icon: Zap
      });
    } else if (lcpAvg < 4000) {
      checks.push({
        component: 'Performance (LCP)',
        status: 'warning',
        message: `LCP: ${lcpAvg.toFixed(0)}ms (Precisa melhorar)`,
        responseTime: Math.round(lcpAvg),
        icon: Zap
      });
    } else {
      checks.push({
        component: 'Performance (LCP)',
        status: 'error',
        message: `LCP: ${lcpAvg.toFixed(0)}ms (Ruim)`,
        responseTime: Math.round(lcpAvg),
        icon: Zap
      });
    }

    // 5. Verificar domínio de produção
    const isProductionDomain = window.location.hostname.includes('senhorsorriso.com.br');
    checks.push({
      component: 'Domínio de Produção',
      status: isProductionDomain ? 'healthy' : 'warning',
      message: isProductionDomain ? 'Domínio correto' : 'Domínio de desenvolvimento',
      icon: Globe
    });

    setHealthChecks(checks);
    setLastCheck(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    runHealthChecks();
    // Executar verificação a cada 5 minutos
    const interval = setInterval(runHealthChecks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Saudável</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      default: return <Badge>Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: HealthStatus['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const overallStatus = healthChecks.some(check => check.status === 'error') ? 'error' :
    healthChecks.some(check => check.status === 'warning') ? 'warning' : 'healthy';

  const healthyCount = healthChecks.filter(check => check.status === 'healthy').length;
  const totalChecks = healthChecks.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            Status do Sistema
            {getStatusBadge(overallStatus)}
          </CardTitle>
          <Button 
            onClick={runHealthChecks} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? 'Verificando...' : 'Atualizar'}
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {healthyCount}/{totalChecks} componentes saudáveis
          {lastCheck && (
            <span className="ml-2">
              • Última verificação: {lastCheck.toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthChecks.map((check, index) => {
            const IconComponent = check.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${getStatusColor(check.status)}`} />
                  <div>
                    <div className="font-medium">{check.component}</div>
                    <div className="text-sm text-gray-600">{check.message}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {check.responseTime && (
                    <span className="text-xs text-gray-500">
                      {check.responseTime}ms
                    </span>
                  )}
                  {getStatusIcon(check.status)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informações adicionais de desenvolvimento */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informações de Desenvolvimento</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• Ambiente: {import.meta.env.MODE}</div>
              <div>• URL Base: {PRODUCTION_CONFIG.APP_URL}</div>
              <div>• Erros recentes: {errorTracker.getRecentErrors(5).length}</div>
              <div>• Métricas coletadas: {performanceMonitor.getMetrics().length}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
