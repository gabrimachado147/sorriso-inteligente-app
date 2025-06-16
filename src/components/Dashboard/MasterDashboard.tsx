
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
  MapPin,
  Activity,
  Filter,
  Search,
  Download,
  RefreshCw,
  Target,
  Zap,
  Star,
  DollarSign,
  UserCheck,
  AlertTriangle,
  Award,
  Crown
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { useAppointments } from '@/hooks/useAppointments';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';

interface MasterDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ appointments, stats }) => {
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { updateAppointmentStatus, updateAppointmentService } = useAppointments();

  // Aplicar filtros
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesClinic = selectedClinic === 'all' || apt.clinic.includes(selectedClinic);
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
      
      return matchesClinic && matchesStatus && matchesSearch && matchesDate;
    });
  }, [appointments, selectedClinic, statusFilter, searchTerm, dateFilter]);

  // Processamento avançado dos dados globais
  const dashboardData = useMemo(() => {
    if (!filteredAppointments || filteredAppointments.length === 0) {
      return {
        totalAppointments: 0,
        todayAppointments: 0,
        confirmedAppointments: 0,
        cancelledAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        noShowAppointments: 0,
        conversionRate: 0,
        retentionRate: 0,
        totalRevenue: 0,
        patientSatisfaction: 0,
        growthTrend: 0,
        monthlyData: [],
        servicesData: [],
        clinicsData: [],
        statusData: [],
        criticalAlerts: [],
        performanceInsights: [],
        topPerformingClinics: [],
        revenueByClinic: []
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = filteredAppointments.filter(apt => apt.date === today);
    const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'confirmed');
    const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled');
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed');
    const noShowAppointments = filteredAppointments.filter(apt => apt.status === 'no_show');
    const pendingAppointments = filteredAppointments.filter(apt => !['confirmed', 'cancelled', 'completed', 'no_show'].includes(apt.status));

    // Métricas avançadas globais
    const uniquePatients = new Set(filteredAppointments.map(apt => apt.phone)).size;
    const returningPatients = filteredAppointments.reduce((acc, apt) => {
      const patientAppointments = filteredAppointments.filter(a => a.phone === apt.phone);
      if (patientAppointments.length > 1) acc.add(apt.phone);
      return acc;
    }, new Set()).size;
    
    const retentionRate = uniquePatients > 0 ? Math.round((returningPatients / uniquePatients) * 100) : 0;
    
    const totalRevenue = filteredAppointments.reduce((total, apt) => {
      const price = (apt as any).price;
      return total + (price || 0);
    }, 0);

    // Dados mensais globais
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthAppointments = filteredAppointments.filter(apt => 
        apt.created_at.startsWith(monthStr)
      );
      const monthConfirmed = monthAppointments.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'completed'
      );
      const monthRevenue = monthAppointments.reduce((total, apt) => {
        const price = (apt as any).price;
        return total + (price || 0);
      }, 0);

      monthlyData.push({
        month: monthName,
        agendamentos: monthAppointments.length,
        conversoes: monthConfirmed.length,
        receita: monthRevenue
      });
    }

    // Crescimento mensal
    const lastMonth = monthlyData[monthlyData.length - 1]?.agendamentos || 0;
    const previousMonth = monthlyData[monthlyData.length - 2]?.agendamentos || 0;
    const growthTrend = previousMonth > 0 ? Math.round(((lastMonth - previousMonth) / previousMonth) * 100) : 0;

    // Performance por clínica com ranking
    const clinicStats = filteredAppointments.reduce((acc, apt) => {
      if (!acc[apt.clinic]) {
        acc[apt.clinic] = { total: 0, confirmed: 0, revenue: 0, completed: 0 };
      }
      acc[apt.clinic].total++;
      if (apt.status === 'confirmed') {
        acc[apt.clinic].confirmed++;
      }
      if (apt.status === 'completed') {
        acc[apt.clinic].completed++;
      }
      const price = (apt as any).price;
      if (price) {
        acc[apt.clinic].revenue += price;
      }
      return acc;
    }, {} as Record<string, { total: number; confirmed: number; revenue: number; completed: number }>);

    const clinicsData = Object.entries(clinicStats)
      .map(([clinic, data]) => ({
        clinic: clinic,
        agendamentos: data.total,
        taxa: Math.round((data.confirmed / data.total) * 100),
        receita: data.revenue,
        concluidos: data.completed,
        score: Math.round((data.confirmed + data.completed * 1.2) / data.total * 100)
      }))
      .sort((a, b) => b.score - a.score);

    // Top 3 clínicas performers
    const topPerformingClinics = clinicsData.slice(0, 3).map((clinic, index) => ({
      ...clinic,
      position: index + 1,
      badge: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
    }));

    // Receita por clínica
    const revenueByClinic = clinicsData.map(clinic => ({
      name: clinic.clinic,
      receita: clinic.receita,
      color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][clinicsData.indexOf(clinic) % 5]
    }));

    // Distribuição de serviços global
    const serviceStats = filteredAppointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const servicesData = Object.entries(serviceStats)
      .map(([service, count], index) => ({
        name: service,
        value: count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'][index % 8]
      }))
      .sort((a, b) => b.value - a.value);

    // Status global
    const statusData = [
      { name: 'Confirmados', value: confirmedAppointments.length, color: '#10b981' },
      { name: 'Pendentes', value: pendingAppointments.length, color: '#f59e0b' },
      { name: 'Cancelados', value: cancelledAppointments.length, color: '#ef4444' },
      { name: 'Não Compareceu', value: noShowAppointments.length, color: '#f97316' },
      { name: 'Concluídos', value: completedAppointments.length, color: '#3b82f6' }
    ].filter(item => item.value > 0);

    const conversionRate = filteredAppointments.length > 0 ? 
      Math.round(((confirmedAppointments.length + completedAppointments.length) / filteredAppointments.length) * 100) : 0;

    // Alertas críticos globais
    const criticalAlerts = [];
    const noShowRate = filteredAppointments.length > 0 ? (noShowAppointments.length / filteredAppointments.length) * 100 : 0;
    const cancelRate = filteredAppointments.length > 0 ? (cancelledAppointments.length / filteredAppointments.length) * 100 : 0;
    
    if (noShowRate > 15) criticalAlerts.push({ type: 'warning', message: `Taxa de não comparecimento alta: ${noShowRate.toFixed(1)}%` });
    if (cancelRate > 20) criticalAlerts.push({ type: 'error', message: `Taxa de cancelamento alta: ${cancelRate.toFixed(1)}%` });
    if (conversionRate < 60) criticalAlerts.push({ type: 'warning', message: `Taxa de conversão baixa: ${conversionRate}%` });

    // Insights de performance global
    const performanceInsights = [];
    if (conversionRate > 80) performanceInsights.push('🎉 Excelente taxa de conversão global!');
    if (retentionRate > 70) performanceInsights.push('💪 Boa retenção de pacientes');
    if (growthTrend > 10) performanceInsights.push('📈 Crescimento acelerado');
    const topService = servicesData[0];
    if (topService && topService.value > filteredAppointments.length * 0.3) {
      performanceInsights.push(`🔥 ${topService.name} é o serviço estrela`);
    }

    const patientSatisfaction = filteredAppointments.length > 0 ? 
      Math.round(((completedAppointments.length + confirmedAppointments.length) / (filteredAppointments.length - pendingAppointments.length)) * 100) : 0;

    return {
      totalAppointments: filteredAppointments.length,
      todayAppointments: todayAppointments.length,
      confirmedAppointments: confirmedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      completedAppointments: completedAppointments.length,
      pendingAppointments: pendingAppointments.length,
      noShowAppointments: noShowAppointments.length,
      conversionRate,
      retentionRate,
      totalRevenue,
      patientSatisfaction,
      growthTrend,
      monthlyData,
      servicesData,
      clinicsData,
      statusData,
      criticalAlerts,
      performanceInsights,
      topPerformingClinics,
      revenueByClinic
    };
  }, [filteredAppointments]);

  // Extrair clínicas únicas para o filtro
  const uniqueClinics = useMemo(() => {
    const clinics = [...new Set(appointments.map(apt => apt.clinic))];
    return clinics.map(clinic => ({
      value: clinic,
      label: clinic
    }));
  }, [appointments]);

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
      ['Nome', 'Telefone', 'Data', 'Horário', 'Clínica', 'Serviço', 'Status'],
      ...filteredAppointments.map(apt => [
        apt.name,
        apt.phone,
        apt.date,
        apt.time,
        apt.clinic,
        apt.service,
        apt.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamentos_global_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header Master */}
      <div className={`${animations.fadeIn}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2 text-purple-600">
              <Crown className="h-8 w-8" />
              Dashboard Master - Gerência Senhor Sorriso 👑
            </h1>
            <p className="text-gray-600">Visão estratégica completa de todas as unidades</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Global
            </Button>
          </div>
        </div>

        {/* Alertas Críticos */}
        {dashboardData.criticalAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {dashboardData.criticalAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg flex items-center gap-2 ${
                alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Insights de Performance */}
        {dashboardData.performanceInsights.length > 0 && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Insights Estratégicos
              </h3>
              <div className="flex flex-wrap gap-2">
                {dashboardData.performanceInsights.map((insight, index) => (
                  <span key={index} className="text-sm bg-white px-3 py-1 rounded-full border">
                    {insight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtros Master */}
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar globalmente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por clínica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Clínicas</SelectItem>
                  {uniqueClinics.map(clinic => (
                    <SelectItem key={clinic.value} value={clinic.value}>
                      {clinic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  <SelectItem value="no_show">Não Compareceu</SelectItem>
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
                  setSelectedClinic('all');
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

      {/* Cards de Estatísticas Master */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className={`border-purple-200 ${animations.slideInLeft}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Global</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.totalAppointments}</p>
                <p className="text-xs text-green-600 mt-1">
                  {dashboardData.growthTrend > 0 ? '+' : ''}{dashboardData.growthTrend}% mês
                </p>
              </div>
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-green-200 ${animations.slideInLeft}`} style={{ animationDelay: '100ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Conversão Global</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.conversionRate}%</p>
                <p className="text-xs text-gray-600 mt-1">{dashboardData.confirmedAppointments + dashboardData.completedAppointments} confirmados</p>
              </div>
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-blue-200 ${animations.slideInLeft}`} style={{ animationDelay: '200ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-blue-600">R$ {dashboardData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-gray-600 mt-1">Todas as unidades</p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-indigo-200 ${animations.slideInLeft}`} style={{ animationDelay: '300ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Retenção</p>
                <p className="text-2xl font-bold text-indigo-600">{dashboardData.retentionRate}%</p>
                <p className="text-xs text-gray-600 mt-1">Pacientes retornando</p>
              </div>
              <UserCheck className="h-6 w-6 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-yellow-200 ${animations.slideInLeft}`} style={{ animationDelay: '400ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.patientSatisfaction}%</p>
                <p className="text-xs text-gray-600 mt-1">Estimada</p>
              </div>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`border-orange-200 ${animations.slideInLeft}`} style={{ animationDelay: '500ms' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Hoje Global</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.todayAppointments}</p>
                <p className="text-xs text-blue-600 mt-1">Agendamentos</p>
              </div>
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking das Top Clínicas */}
      <Card className="border-gold-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Award className="h-6 w-6" />
            Top 3 Clínicas Performers 🏆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.topPerformingClinics.map((clinic, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                index === 0 ? 'border-yellow-300 bg-yellow-50' :
                index === 1 ? 'border-gray-300 bg-gray-50' :
                'border-orange-300 bg-orange-50'
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">{clinic.badge}</div>
                  <h3 className="font-bold text-lg">{clinic.clinic}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <p className="text-xs text-gray-600">Agendamentos</p>
                      <p className="font-semibold text-lg">{clinic.agendamentos}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Taxa</p>
                      <p className="font-semibold text-lg text-green-600">{clinic.taxa}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600">Receita</p>
                      <p className="font-semibold text-blue-600">R$ {clinic.receita.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge className={`mt-2 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-500' :
                    'bg-orange-500'
                  }`}>
                    Score: {clinic.score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Master */}
      <Tabs defaultValue="overview" className={`${animations.fadeIn}`}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Global</TabsTrigger>
          <TabsTrigger value="clinics">Ranking Clínicas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">Tendência Global - 6 Meses</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => [
                        name === 'receita' ? `R$ ${Number(value).toLocaleString()}` : value,
                        name === 'agendamentos' ? 'Agendamentos' : 
                        name === 'conversoes' ? 'Confirmados' : 'Receita'
                      ]} />
                      <Area yAxisId="left" type="monotone" dataKey="agendamentos" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Area yAxisId="left" type="monotone" dataKey="conversoes" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Bar yAxisId="right" dataKey="receita" fill="#f59e0b" fillOpacity={0.3} />
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
                <CardTitle className="text-green-700">Status Global</CardTitle>
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
          </div>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Performance Detalhada por Clínica</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.clinicsData.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.clinicsData.map((clinic, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{clinic.clinic}</h3>
                            <p className="text-sm text-gray-600">{clinic.agendamentos} agendamentos totais</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Taxa de Conversão</p>
                            <p className="text-lg font-bold text-green-600">{clinic.taxa}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Receita Total</p>
                            <p className="text-lg font-bold text-blue-600">R$ {clinic.receita.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Score Performance</p>
                            <Badge variant={index < 3 ? 'default' : 'outline'} className={
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-500' :
                              index === 2 ? 'bg-orange-500' : ''
                            }>
                              {clinic.score}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  Sem dados de clínicas
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-700">Distribuição de Serviços Global</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.servicesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.servicesData.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.servicesData.slice(0, 6).map((entry, index) => (
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

            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">Indicadores Estratégicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Taxa de Conversão Global</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{dashboardData.conversionRate}%</p>
                      <p className="text-xs text-gray-600">Meta: 75%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span>Taxa de Retenção</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">{dashboardData.retentionRate}%</p>
                      <p className="text-xs text-gray-600">Meta: 60%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Satisfação Estimada</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">{dashboardData.patientSatisfaction}%</p>
                      <p className="text-xs text-gray-600">Meta: 85%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span>Crescimento Mensal</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{dashboardData.growthTrend}%</p>
                      <p className="text-xs text-gray-600">vs mês anterior</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Receita por Clínica</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.revenueByClinic.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dashboardData.revenueByClinic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, 'Receita']} />
                    <Bar dataKey="receita" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  Sem dados de receita
                </div>
              )}
            </CardContent>
          </Card>
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
