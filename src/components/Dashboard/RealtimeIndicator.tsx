
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface RealtimeIndicatorProps {
  connected: boolean;
}

export const RealtimeIndicator: React.FC<RealtimeIndicatorProps> = ({ connected }) => {
  return (
    <Badge 
      variant={connected ? "default" : "secondary"} 
      className={`flex items-center gap-1 ${
        connected 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      {connected ? (
        <>
          <Wifi className="h-3 w-3" />
          Tempo Real Ativo
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Desconectado
        </>
      )}
    </Badge>
  );
};
