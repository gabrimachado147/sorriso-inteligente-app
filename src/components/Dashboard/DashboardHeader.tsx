
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { RealtimeIndicator } from './RealtimeIndicator';
import { animations } from '@/lib/animations';

interface DashboardHeaderProps {
  realtimeConnected: boolean;
  isLoading: boolean;
  onManualRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  realtimeConnected,
  isLoading,
  onManualRefresh
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <RealtimeIndicator connected={realtimeConnected} />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onManualRefresh}
          disabled={isLoading}
          className={animations.buttonHover}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
    </div>
  );
};
