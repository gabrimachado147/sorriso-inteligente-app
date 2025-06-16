
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { animations } from '@/lib/animations';

interface StatsCardsProps {
  stats: any;
  statsLoading: boolean;
  filteredAppointmentsCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats, 
  statsLoading, 
  filteredAppointmentsCount 
}) => {
  return (
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
            {filteredAppointmentsCount} na clínica selecionada
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
  );
};
