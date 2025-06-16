
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Smartphone, Monitor } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const NotificationStatus: React.FC = () => {
  const { permission, isSupported, requestPermission } = usePushNotifications();

  const getStatusInfo = () => {
    if (!isSupported) {
      return {
        icon: <Monitor className="h-5 w-5 text-gray-500" />,
        status: 'Não Suportado',
        description: 'Seu navegador não suporta notificações push',
        variant: 'secondary' as const,
        action: null
      };
    }

    switch (permission) {
      case 'granted':
        return {
          icon: <Bell className="h-5 w-5 text-green-600" />,
          status: 'Ativo',
          description: 'Você receberá notificações de novos agendamentos',
          variant: 'default' as const,
          action: null
        };
      case 'denied':
        return {
          icon: <BellOff className="h-5 w-5 text-red-600" />,
          status: 'Negado',
          description: 'Notificações foram bloqueadas pelo navegador',
          variant: 'destructive' as const,
          action: (
            <p className="text-xs text-red-600 mt-2">
              Ative manualmente nas configurações do navegador
            </p>
          )
        };
      default:
        return {
          icon: <Smartphone className="h-5 w-5 text-yellow-600" />,
          status: 'Pendente',
          description: 'Clique para ativar notificações push',
          variant: 'outline' as const,
          action: (
            <Button
              size="sm"
              onClick={requestPermission}
              className="mt-2"
            >
              Ativar Notificações
            </Button>
          )
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {statusInfo.icon}
          Notificações Push
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={statusInfo.variant}>
            {statusInfo.status}
          </Badge>
        </div>
        
        <p className="text-xs text-gray-600 mb-2">
          {statusInfo.description}
        </p>
        
        {statusInfo.action}
        
        {permission === 'granted' && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700">
                Sistema de notificações ativo
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
