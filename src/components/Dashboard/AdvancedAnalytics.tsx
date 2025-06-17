
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Clock, Target, Award } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface AdvancedAnalyticsProps {
  appointments: AppointmentRecord[];
  clinicName?: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ appointments, clinicName }) => {
  // Cálculos de analytics avançados
  const analytics = React.useMemo(() => {
    const now = new Date();
    const thisMonth = appointments.filter(apt => {
      const aptDate = new Date(apt.created_at);
      return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();
    });

    const lastMonth = appointments.filter(apt => {
      const aptDate = new Date(apt.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return aptDate.getMonth() === lastMonthDate.getMonth() && aptDate.getFullYear() === lastMonthDate.getFullYear();
    });

    // Taxa de conversão
    const conversionRate = appointments.length > 0 ? 
      Math.round((appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length / appointments.length) * 100) : 0;

    // Taxa de no-show
    const noShowRate = appointments.length > 0 ? 
      Math.round((appointments.filter(apt => apt.status === 'no_show').length / appointments.length) * 100) : 0;

    // Receita estimada
    const estimatedRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((total, apt) => total + ((apt as any).price || 150), 0);

    // Horários mais populares
    const timeSlots = appointments.reduce((acc, apt) => {
      const hour = parseInt(apt.time.split(':')[0]);
      const timeSlot = `${hour}:00`;
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularTimes = Object.entries(timeSlots)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([time, count]) => ({ time, count }));

    // Tendência semanal
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === date.toDateString();
      });
      
      weeklyTrend.push({
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        appointments: dayAppointments.length,
        conversions: dayAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length
      });
    }

    // Distribuição por serviço
    const serviceDistribution = appointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topServices = Object.entries(serviceDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([service, count], index) => ({
        name: service,
        value: count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
      }));

    return {
      thisMonthCount: thisMonth.length,
      lastMonthCount: lastMonth.length,
      conversionRate,
      noShowRate,
      estimatedRevenue,
      popularTimes,
      weeklyTrend,
      topServices,
      growthRate: lastMonth.length > 0 ? Math.round(((thisMonth.length - lastMonth.length) / lastMonth.length) * 100) : 0
    };
  }, [appointments]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-green-600">{analytics.conversionRate}%</p>
              </div>
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">No-Show Rate</p>
                <p className="text-2xl font-bold text-red-600">{analytics.noShowRate}%</p>
              </div>
              <Clock className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Receita Estimada</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {analytics.estimatedRevenue.toLocaleString('pt-BR')}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Crescimento</p>
                <div className="flex items-center gap-1">
                  <p className={`text-2xl font-bold ${analytics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.growthRate > 0 ? '+' : ''}{analytics.growthRate}%
                  </p>
                  {analytics.growthRate >= 0 ? 
                    <TrendingUp className="h-4 w-4 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  }
                </div>
              </div>
              <Award className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tendência Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analytics.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Serviços Mais Procurados */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Serviços Mais Procurados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.topServices}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {analytics.topServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Horários Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Horários Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.popularTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Insights Inteligentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.conversionRate > 80 && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  🎉 Excelente
                </Badge>
                <span className="text-sm">Taxa de conversão muito alta!</span>
              </div>
            )}
            
            {analytics.noShowRate > 15 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  ⚠️ Atenção
                </Badge>
                <span className="text-sm">Alto índice de no-show</span>
              </div>
            )}
            
            {analytics.growthRate > 20 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  📈 Crescimento
                </Badge>
                <span className="text-sm">Crescimento acelerado este mês!</span>
              </div>
            )}

            {analytics.popularTimes.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  🕒 Dica
                </Badge>
                <span className="text-sm">
                  Horário mais procurado: {analytics.popularTimes[0]?.time}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
