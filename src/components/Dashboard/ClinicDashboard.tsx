
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Filter,
  Search,
  Download,
  RefreshCw,
  Target,
  DollarSign,
  Star
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';

interface ClinicDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
  clinicName: string;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ appointments, stats, clinicName }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateAppointmentStatus, updateAppointmentService } = useAppointments();

  // Filtrar apenas agendamentos da clínica específica
  const clinicAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const appointmentClinic = apt.clinic.toLowerCase();
      const userClinic = clinicName.toLowerCase();
      
      return appointmentClinic.includes(userClinic) || 
             apt.clinic === clinicName;
    });
  }, [appointments, clinicName]);

  // Aplicar filtros adicionais
  const filteredAppointments = useMemo(() => {
    return clinicAppointments.filter(apt => {
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const matchesSearch = !searchTerm || 
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.phone.includes(searchTerm) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const today = new Date();
        const aptDate = new Date(apt.date);
        
        switch (dateFilter) {
          case 'today': {
            matchesDate = aptDate.toDateString() === today.toDateString();
            break;
          }
          case 'week': {
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = aptDate >= weekAgo;
            break;
          }
          case 'month': {
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = aptDate >= monthAgo;
            break;
          }
        }
      }
      
      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [clinicAppointments, statusFilter, searchTerm, dateFilter]);

  // Processamento dos dados da clínica
  const dashboardData = useMemo(() => {
    if (!filteredAppointments || filteredAppointments.length === 0) {
      return {
        totalAppointments: 0,
        todayAppointments: 0,
        confirmedAppointments: 0,
        cancelledAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        conversionRate: 0,
        totalRevenue: 0,
        monthlyData: [],
        servicesData: [],
        statusData: []
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = filteredAppointments.filter(apt => apt.date === today);
    const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'confirmed');
    const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled');
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed');
    const pendingAppointments = filteredAppointments.filter(apt => !['confirmed', 'cancelled', 'completed', 'no_show'].includes(apt.status));

    const conversionRate = filteredAppointments.length > 0 ? 
      Math.round(((confirmedAppointments.length + completedAppointments.length) / filteredAppointments.length) * 100) : 0;

    const totalRevenue = filteredAppointments.reduce((total, apt) => {
      const price = (apt as any).price;
      return total + (price || 0);
    }, 0);

    // Dados mensais dos últimos 6 meses
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthAppointments = filteredAppointments.filter(apt => 
        apt.created_at.startsWith(monthStr)
      );

      monthlyData.push({
        month: monthName,
        agendamentos: monthAppointments.length,
        conversoes: monthAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length
      });
    }

    // Distribuição de serviços
    const serviceStats = filteredAppointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const servicesData = Object.entries(serviceStats)
      .map(([service, count], index) => ({
        name: service,
        value: count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
      }))
      .sort((a, b) => b.value - a.value);

    // Dados de status
    const statusData = [
      { name: 'Confirmados', value: confirmedAppointments.length, color: '#10b981' },
      { name: 'Pendentes', value: pendingAppointments.length, color: '#f59e0b' },
      { name: 'Cancelados', value: cancelledAppointments.length, color: '#ef4444' },
      { name: 'Concluídos', value: completedAppointments.length, color: '#3b82f6' }
    ].filter(item => item.value > 0);

    return {
      totalAppointments: filteredAppointments.length,
      todayAppointments: todayAppointments.length,
      confirmedAppointments: confirmedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      completedAppointments: completedAppointments.length,
      pendingAppointments: pendingAppointments.length,
      conversionRate,
      totalRevenue,
      monthlyData,
      servicesData,
      statusData
    };
  }, [filteredAppointments]);

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    try {
      await updateAppointmentStatus.mutateAsync({ appointmentId, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleUpdateService = async (appointmentId: string, service: string, price?: number) => {
    try {
      await updateAppointmentService.mutateAsync({ appointmentId, service, price });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Nome', 'Telefone', 'Data', 'Horário', 'Serviço', 'Status'],
      ...filteredAppointments.map(apt => [
        apt.name,
        apt.phone,
        apt.date,
        apt.time,
        apt.service,
        apt.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos_${clinicName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className={`${animations.fadeIn}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 text-blue-600">
              <BarChart3 className="h-8 w-8" />
              Dashboard - {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)} 🏥
            </h1>
            <p className="text-gray-600">Gestão de agendamentos da sua unidade</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('all');
                  setSearchTerm('');
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`border-blue-200 ${animations.slideInLeft}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Agendamentos</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.totalAppointments}</p>
              </div>
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-green-200 ${animations.slideInLeft}`} style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.conversionRate}%</p>
              </div>
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-purple-200 ${animations.slideInLeft}`} style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-purple-600">R$ {dashboardData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-orange-200 ${animations.slideInLeft}`} style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.todayAppointments}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className={`${animations.fadeIn}`}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Tendência Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="agendamentos" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="conversoes" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Distribuição de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.servicesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.servicesData.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.servicesData.slice(0, 5).map((entry, index) => (
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">Status dos Agendamentos</CardTitle>
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

            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-700">Métricas de Performance</CardTitle>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <AppointmentsTable
            appointments={filteredAppointments}
            onStatusChange={handleUpdateStatus}
            onServiceUpdate={handleUpdateService}
            isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
