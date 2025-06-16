
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsTabProps {
  stats: any;
  statsLoading: boolean;
  realtimeConnected: boolean;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  stats,
  statsLoading,
  realtimeConnected
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics e Relatórios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Por Clínica</h4>
              {statsLoading ? (
                <p>Carregando...</p>
              ) : (
                <div className="space-y-2">
                  {stats?.byClinic && Object.entries(stats.byClinic).map(([clinic, count]) => (
                    <div key={clinic} className="flex justify-between">
                      <span className="text-sm">{clinic}</span>
                      <span className="font-medium">{String(count)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Status dos Agendamentos</h4>
              {statsLoading ? (
                <p>Carregando...</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Confirmados</span>
                    <span className="font-medium text-green-600">{stats?.confirmed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Concluídos</span>
                    <span className="font-medium text-blue-600">{stats?.completed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cancelados</span>
                    <span className="font-medium text-red-600">{stats?.cancelled || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🔄 Atualizações em Tempo Real</h4>
            <p className="text-blue-800 text-sm">
              {realtimeConnected 
                ? '✅ Dashboard conectado - Você receberá notificações instantâneas de novos agendamentos via chat'
                : '⚠️ Conexão em tempo real indisponível - Use o botão Atualizar para ver novos dados'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
