
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Activity
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface AdminDashboardProps {
  appointments: AppointmentRecord[];
  stats: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, stats }) => {
  // Processamento inteligente dos dados reais
  const dashboardData = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return {
        totalAppointments: 0,
        todayAppointments: 0,
        confirmedAppointments: 0,
        cancelledAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        noShowAppointments: 0,
        conversionRate: 0,
        monthlyData: [],
        servicesData: [],
        clinicsData: [],
        statusData: [],
        recentAppointments: []
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const noShowAppointments = appointments.filter(apt => apt.status === 'no_show');
    const pendingAppointments = appointments.filter(apt => !['confirmed', 'cancelled', 'completed', 'no_show'].includes(apt.status));

    // Dados mensais dos últimos 6 meses
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthAppointments = appointments.filter(apt => 
        apt.created_at.startsWith(monthStr)
      );
      const monthConfirmed = monthAppointments.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'completed'
      );

      monthlyData.push({
        month: monthName,
        agendamentos: monthAppointments.length,
        conversoes: monthConfirmed.length
      });
    }

    // Distribuição de serviços
    const serviceStats = appointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const servicesData = Object.entries(serviceStats)
      .map(([service, count], index) => ({
        name: service,
        value: count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Performance por clínica
    const clinicStats = appointments.reduce((acc, apt) => {
      if (!acc[apt.clinic]) {
        acc[apt.clinic] = { total: 0, confirmed: 0 };
      }
      acc[apt.clinic].total++;
      if (apt.status === 'confirmed' || apt.status === 'completed') {
        acc[apt.clinic].confirmed++;
      }
      return acc;
    }, {} as Record<string, { total: number; confirmed: number }>);

    const clinicsData = Object.entries(clinicStats)
      .map(([clinic, data]) => ({
        clinic: clinic,
        agendamentos: data.total,
        taxa: Math.round((data.confirmed / data.total) * 100)
      }))
      .sort((a, b) => b.agendamentos - a.agendamentos);

    // Dados de status para gráfico
    const statusData = [
      { name: 'Confirmados', value: confirmedAppointments.length, color: '#10b981' },
      { name: 'Pendentes', value: pendingAppointments.length, color: '#f59e0b' },
      { name: 'Cancelados', value: cancelledAppointments.length, color: '#ef4444' },
      { name: 'Não Compareceu', value: noShowAppointments.length, color: '#f97316' },
      { name: 'Concluídos', value: completedAppointments.length, color: '#3b82f6' }
    ].filter(item => item.value > 0);

    const conversionRate = appointments.length > 0 ? 
      Math.round(((confirmedAppointments.length + completedAppointments.length) / appointments.length) * 100) : 0;

    // Agendamentos recentes (últimos 10)
    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return {
      totalAppointments: appointments.length,
      todayAppointments: todayAppointments.length,
      confirmedAppointments: confirmedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      completedAppointments: completedAppointments.length,
      pendingAppointments: pendingAppointments.length,
      noShowAppointments: noShowAppointments.length,
      conversionRate,
      monthlyData,
      servicesData,
      clinicsData,
      statusData,
      recentAppointments
    };
  }, [appointments]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>;
      case 'no_show':
        return <Badge className="bg-orange-100 text-orange-800">Não Compareceu</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn}`}>
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Dashboard Administrativo 👩‍⚕️
        </h1>
        <p className="text-gray-600">Visão completa dos agendamentos e performance em tempo real</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${animations.slideInLeft}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agendamentos</p>
                <p className="text-3xl font-bold text-primary">{dashboardData.totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">
              +{dashboardData.todayAppointments} hoje
            </p>
          </CardContent>
        </Card>

        <Card className={`${animations.slideInLeft}`} style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {dashboardData.confirmedAppointments + dashboardData.completedAppointments} confirmados
            </p>
          </CardContent>
        </Card>

        <Card className={`${animations.slideInLeft}`} style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pacientes Únicos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(appointments.map(apt => apt.phone)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">Base de pacientes</p>
          </CardContent>
        </Card>

        <Card className={`${animations.slideInLeft}`} style={{ animationDelay: '300ms' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-3xl font-bold text-orange-600">{dashboardData.todayAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-blue-600 mt-2">Agendamentos do dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Organizadas */}
      <Tabs defaultValue="overview" className={`${animations.fadeIn}`}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clinics">Clínicas</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="agendamentos" fill="#3b82f6" name="Agendamentos" />
                      <Bar dataKey="conversoes" fill="#10b981" name="Confirmados" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.servicesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.servicesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    Sem dados de serviços
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    Sem dados de status
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Confirmados</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {dashboardData.confirmedAppointments}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <span>Concluídos</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {dashboardData.completedAppointments}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <span>Pendentes</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {dashboardData.pendingAppointments}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span>Cancelados</span>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {dashboardData.cancelledAppointments}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <span>Não Compareceu</span>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      {dashboardData.noShowAppointments}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Clínica</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.clinicsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dashboardData.clinicsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="clinic" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="agendamentos" fill="#3b82f6" name="Agendamentos" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  Sem dados de clínicas
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {dashboardData.recentAppointments.length > 0 ? (
                  dashboardData.recentAppointments.map((apt, index) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">{apt.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{apt.phone}</span>
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{apt.clinic}</span>
                          </div>
                          <p className="text-sm text-gray-600">{apt.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.date}</p>
                        <p className="text-xs text-gray-600">{apt.time}</p>
                        <div className="mt-1">
                          {getStatusBadge(apt.status)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum agendamento encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
