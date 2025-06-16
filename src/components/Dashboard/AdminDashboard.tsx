
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentsSection } from './AppointmentsSection';
import { Calendar, Users, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { RealtimeIndicator } from './RealtimeIndicator';
import { animations } from '@/lib/animations';

export const AdminDashboard = () => {
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const { 
    appointments, 
    isLoading, 
    stats, 
    statsLoading, 
    refetch 
  } = useAppointments();
  const { realtimeConnected } = useRealtimeAppointments();

  // Filter appointments by selected clinic
  const filteredAppointments = selectedClinic === 'all' 
    ? appointments 
    : appointments.filter(apt => 
        apt.clinic_filter === selectedClinic || apt.clinic.includes(selectedClinic)
      );

  const availableClinics = [
    'all',
    'Senhor Sorriso Capão Bonito - Capão',
    'Senhor Sorriso Capão Bonito - Centro', 
    'Senhor Sorriso Campobelo',
    'Senhor Sorriso Itapeva',
    'Senhor Sorriso Taquarivaí'
  ];

  const getClinicDisplayName = (clinic: string) => {
    if (clinic === 'all') return 'Todas as Clínicas';
    return clinic.replace('Senhor Sorriso ', '');
  };

  const handleManualRefresh = () => {
    console.log('[Admin Dashboard] Manual refresh triggered');
    refetch();
  };

  // Log realtime status changes
  useEffect(() => {
    console.log('[Admin Dashboard] Realtime connection status:', realtimeConnected);
  }, [realtimeConnected]);

  return (
    <div className="space-y-6">
      {/* Header with Realtime Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <RealtimeIndicator connected={realtimeConnected} />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className={animations.buttonHover}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredAppointments.length} na clínica selecionada
            </p>
          </CardContent>
        </Card>

        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.today || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos hoje
            </p>
          </CardContent>
        </Card>

        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.confirmed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Status confirmado
            </p>
          </CardContent>
        </Card>

        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.thisMonth || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos do mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clinic Filter */}
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle>Filtro por Unidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableClinics.map((clinic) => (
              <Badge
                key={clinic}
                variant={selectedClinic === clinic ? "default" : "outline"}
                className={`cursor-pointer transition-all ${animations.buttonHover} ${
                  selectedClinic === clinic ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => setSelectedClinic(clinic)}
              >
                {getClinicDisplayName(clinic)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <AppointmentsSection 
            appointments={filteredAppointments} 
            selectedClinic={selectedClinic}
            realtimeConnected={realtimeConnected}
          />
        </TabsContent>

        <TabsContent value="analytics">
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
                            <span className="font-medium">{count}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
