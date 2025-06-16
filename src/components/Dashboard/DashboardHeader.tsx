
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Activity, Shield, Building2 } from 'lucide-react';
import { animations } from '@/lib/animations';

interface DashboardHeaderProps {
  realtimeConnected: boolean;
  isLoading: boolean;
  onManualRefresh: () => void;
  userInfo?: {
    isMasterUser: boolean;
    clinicName?: string;
  };
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  realtimeConnected,
  isLoading,
  onManualRefresh,
  userInfo
}) => {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${animations.fadeIn}`}>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Badge de nível de acesso */}
          {userInfo?.isMasterUser ? (
            <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200">
              <Shield className="h-3 w-3 mr-1" />
              Gerência - Acesso Total
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Building2 className="h-3 w-3 mr-1" />
              {userInfo?.clinicName || 'Unidade Específica'}
            </Badge>
          )}
          
          {/* Badge de conexão realtime */}
          <Badge 
            variant={realtimeConnected ? "default" : "secondary"}
            className={realtimeConnected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
          >
            <Activity className="h-3 w-3 mr-1" />
            {realtimeConnected ? 'Tempo Real Ativo' : 'Tempo Real Inativo'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onManualRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
    </div>
  );
};
