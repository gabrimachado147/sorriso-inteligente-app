
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle, Building2 } from 'lucide-react';
import { animations } from '@/lib/animations';

interface ClinicStatsCardsProps {
  stats: {
    total: number;
    today: number;
    confirmed: number;
    thisMonth: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  statsLoading: boolean;
  clinicName?: string;
}

export const ClinicStatsCards: React.FC<ClinicStatsCardsProps> = ({ 
  stats, 
  statsLoading, 
  clinicName 
}) => {
  const conversionRate = stats.total > 0 ? 
    Math.round(((stats.confirmed + stats.completed) / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header da Unidade */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">{clinicName}</h2>
            <p className="text-blue-100">Visão geral dos agendamentos da sua unidade</p>
          </div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {statsLoading ? '...' : stats.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Todos os agendamentos da unidade
            </p>
          </CardContent>
        </Card>

        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {statsLoading ? '...' : stats.today}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos para hoje
            </p>
          </CardContent>
        </Card>

        <Card className={animations.fadeIn}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {statsLoading ? '...' : stats.confirmed}
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
            <div className="text-3xl font-bold text-purple-600">
              {statsLoading ? '...' : stats.thisMonth}
            </div>
            <p className="text-xs text-muted-foreground">
              Agendamentos do mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">
                  {statsLoading ? '...' : stats.completed}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Cancelados</p>
                <p className="text-2xl font-bold text-red-600">
                  {statsLoading ? '...' : stats.cancelled}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Não Compareceu</p>
                <p className="text-2xl font-bold text-orange-600">
                  {statsLoading ? '...' : stats.noShow}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taxa de Conversão */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Taxa de Conversão</h3>
              <p className="text-sm text-blue-700">
                Percentual de agendamentos confirmados + concluídos
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{conversionRate}%</div>
              <Badge 
                variant={conversionRate >= 80 ? "default" : conversionRate >= 60 ? "secondary" : "destructive"}
                className="mt-2"
              >
                {conversionRate >= 80 ? "Excelente" : conversionRate >= 60 ? "Bom" : "Precisa melhorar"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
