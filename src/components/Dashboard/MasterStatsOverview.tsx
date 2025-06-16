
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Users, Target, Crown } from 'lucide-react';
import { animations } from '@/lib/animations';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface MasterStatsOverviewProps {
  appointments: AppointmentRecord[];
  stats: any;
  statsLoading: boolean;
}

export const MasterStatsOverview: React.FC<MasterStatsOverviewProps> = ({
  appointments,
  stats,
  statsLoading
}) => {
  // Calcular estatísticas por clínica
  const clinicStats = React.useMemo(() => {
    const clinicsData = appointments.reduce((acc, apt) => {
      if (!acc[apt.clinic]) {
        acc[apt.clinic] = {
          total: 0,
          confirmed: 0,
          completed: 0,
          today: 0
        };
      }
      
      acc[apt.clinic].total++;
      
      if (apt.status === 'confirmed') acc[apt.clinic].confirmed++;
      if (apt.status === 'completed') acc[apt.clinic].completed++;
      
      const today = new Date().toISOString().split('T')[0];
      if (apt.date === today) acc[apt.clinic].today++;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(clinicsData)
      .map(([clinic, data]) => ({
        clinic,
        ...data,
        conversionRate: Math.round(((data.confirmed + data.completed) / data.total) * 100)
      }))
      .sort((a, b) => b.total - a.total);
  }, [appointments]);

  const totalClinics = clinicStats.length;
  const averageConversion = clinicStats.length > 0 
    ? Math.round(clinicStats.reduce((acc, clinic) => acc + clinic.conversionRate, 0) / clinicStats.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Master */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Painel Gerencial</h2>
            <p className="text-purple-100">Visão completa de todas as unidades da rede</p>
          </div>
        </div>
      </div>

      {/* Métricas Globais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total de Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{totalClinics}</div>
            <p className="text-xs text-purple-600">Unidades ativas</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Agendamentos Globais</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {statsLoading ? '...' : stats?.total || appointments.length}
            </div>
            <p className="text-xs text-blue-600">Todas as unidades</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Conversão Média</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{averageConversion}%</div>
            <p className="text-xs text-green-600">Taxa média da rede</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pacientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {new Set(appointments.map(apt => apt.phone)).size}
            </div>
            <p className="text-xs text-orange-600">Todos os pacientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Ranking das Unidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ranking de Performance das Unidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clinicStats.slice(0, 5).map((clinic, index) => (
              <div key={clinic.clinic} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-400' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{clinic.clinic}</h4>
                    <p className="text-sm text-gray-600">
                      {clinic.total} agendamentos • {clinic.today} hoje
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{clinic.conversionRate}%</div>
                  <Badge 
                    variant={clinic.conversionRate >= 80 ? "default" : 
                             clinic.conversionRate >= 60 ? "secondary" : "destructive"}
                  >
                    {clinic.conversionRate >= 80 ? "Excelente" : 
                     clinic.conversionRate >= 60 ? "Bom" : "Baixo"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
