import React, { useMemo, useState } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { LazyDashboard } from './LazyDashboard';
import { Badge } from '@/components/ui/badge';
import { useAppointments } from '@/hooks/useAppointments';

interface AdminDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointments, stats }) => {
  // Obter clínica do usuário logado
  const loggedInClinic = sessionStorage.getItem('staffClinic');

  // Filtros de dashboard
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Mutations para atualização
  const { updateAppointmentStatus, updateAppointmentService, updateAppointment } = useAppointments();

  // Filtrar agendamentos pela clínica do usuário logado PRIMEIRO
  const clinicFilteredAppointments = useMemo(() => {
    if (!loggedInClinic) return appointments;
    
    return appointments.filter(apt => {
      const appointmentClinic = apt.clinic.toLowerCase();
      const userClinic = loggedInClinic.toLowerCase();
      
      // Verificar se a clínica do agendamento corresponde à clínica do usuário
      return appointmentClinic.includes(userClinic) || 
             apt.clinic === loggedInClinic;
    });
  }, [appointments, loggedInClinic]);

  // Aplicar filtros adicionais aos agendamentos já filtrados por clínica
  const filteredAppointments = useMemo(() => {
    return clinicFilteredAppointments.filter(apt => {
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
  }, [clinicFilteredAppointments, selectedClinic, statusFilter, searchTerm, dateFilter]);

  // Processamento inteligente dos dados filtrados com novas métricas (usando apenas agendamentos da clínica)
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
        avgTimeToConfirm: 0,
        peakHours: [],
        monthlyData: [],
        servicesData: [],
        clinicsData: [],
        statusData: [],
        recentAppointments: [],
        totalRevenue: 0,
        patientSatisfaction: 0,
        criticalAlerts: [],
        performanceInsights: [],
        growthTrend: 0
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = filteredAppointments.filter(apt => apt.date === today);
    const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'confirmed');
    const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled');
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed');
    const noShowAppointments = filteredAppointments.filter(apt => apt.status === 'no_show');
    const pendingAppointments = filteredAppointments.filter(apt => !['confirmed', 'cancelled', 'completed', 'no_show'].includes(apt.status));

    // Métricas avançadas
    const uniquePatients = new Set(filteredAppointments.map(apt => apt.phone)).size;
    const returningPatients = filteredAppointments.reduce((acc, apt) => {
      const patientAppointments = filteredAppointments.filter(a => a.phone === apt.phone);
      if (patientAppointments.length > 1) acc.add(apt.phone);
      return acc;
    }, new Set()).size;
    
    const retentionRate = uniquePatients > 0 ? Math.round((returningPatients / uniquePatients) * 100) : 0;
    
    // Receita real baseada nos valores inseridos pelos funcionários
    const totalRevenue = filteredAppointments.reduce((total, apt) => {
      const price = (apt as AppointmentRecord & { price?: number }).price;
      return total + (price || 0);
    }, 0);

    // Horários de pico
    const hourStats = filteredAppointments.reduce((acc, apt) => {
      const hour = apt.time.split(':')[0];
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakHours = Object.entries(hourStats)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

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
      const monthConfirmed = monthAppointments.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'completed'
      );
      const monthRevenue = monthAppointments.reduce((total, apt) => {
        const price = (apt as AppointmentRecord & { price?: number }).price;
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

    // Distribuição de serviços
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

    // Performance por clínica (agora só mostra a clínica do usuário)
    const clinicStats = filteredAppointments.reduce((acc, apt) => {
      if (!acc[apt.clinic]) {
        acc[apt.clinic] = { total: 0, confirmed: 0, revenue: 0 };
      }
      acc[apt.clinic].total++;
      if (apt.status === 'confirmed' || apt.status === 'completed') {
        acc[apt.clinic].confirmed++;
      }
      const price = (apt as AppointmentRecord & { price?: number }).price;
      if (price) {
        acc[apt.clinic].revenue += price;
      }
      return acc;
    }, {} as Record<string, { total: number; confirmed: number; revenue: number }>);

    const clinicsData = Object.entries(clinicStats)
      .map(([clinic, data]) => ({
        clinic: clinic,
        agendamentos: data.total,
        taxa: Math.round((data.confirmed / data.total) * 100),
        receita: data.revenue
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

    const conversionRate = filteredAppointments.length > 0 ? 
      Math.round(((confirmedAppointments.length + completedAppointments.length) / filteredAppointments.length) * 100) : 0;

    // Agendamentos recentes
    const recentAppointments = [...filteredAppointments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // Alertas críticos
    const criticalAlerts = [];
    const noShowRate = filteredAppointments.length > 0 ? (noShowAppointments.length / filteredAppointments.length) * 100 : 0;
    const cancelRate = filteredAppointments.length > 0 ? (cancelledAppointments.length / filteredAppointments.length) * 100 : 0;
    
    if (noShowRate > 15) criticalAlerts.push({ type: 'warning', message: `Taxa de não comparecimento alta: ${noShowRate.toFixed(1)}%` });
    if (cancelRate > 20) criticalAlerts.push({ type: 'error', message: `Taxa de cancelamento alta: ${cancelRate.toFixed(1)}%` });
    if (conversionRate < 60) criticalAlerts.push({ type: 'warning', message: `Taxa de conversão baixa: ${conversionRate}%` });
    if (pendingAppointments.length > 20) criticalAlerts.push({ type: 'info', message: `${pendingAppointments.length} agendamentos pendentes` });

    // Insights de performance
    const performanceInsights = [];
    if (conversionRate > 80) performanceInsights.push('🎉 Excelente taxa de conversão!');
    if (retentionRate > 70) performanceInsights.push('💪 Boa retenção de pacientes');
    if (growthTrend > 10) performanceInsights.push('📈 Crescimento acelerado');
    const topService = servicesData[0];
    if (topService && topService.value > filteredAppointments.length * 0.3) {
      performanceInsights.push(`🔥 ${topService.name} é o serviço estrela`);
    }

    // Satisfação estimada (baseada em conclusões vs cancelamentos)
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
      avgTimeToConfirm: 2.5, // Simulado
      peakHours,
      monthlyData,
      servicesData,
      clinicsData,
      statusData,
      recentAppointments,
      totalRevenue,
      patientSatisfaction,
      criticalAlerts,
      performanceInsights,
      growthTrend
    };
  }, [filteredAppointments]);

  // Extrair clínicas únicas para o filtro (apenas da clínica do usuário)
  const uniqueClinics = useMemo(() => {
    const clinics = [...new Set(clinicFilteredAppointments.map(apt => apt.clinic))];
    return clinics.map(clinic => ({
      value: clinic,
      label: clinic
    }));
  }, [clinicFilteredAppointments]);

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

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    try {
      console.log('AdminDashboard: Updating status:', appointmentId, newStatus);
      await updateAppointmentStatus.mutateAsync({ appointmentId, status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleUpdateService = async (appointmentId: string, service: string, price?: number) => {
    try {
      console.log('AdminDashboard: Updating service:', appointmentId, service, price);
      await updateAppointmentService.mutateAsync({ appointmentId, service, price });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  };

  const handleUpdateAppointment = async (appointmentId: string, updates: { name?: string; phone?: string; email?: string; date?: string; time?: string; clinic?: string; notes?: string }) => {
    try {
      console.log('AdminDashboard: Updating appointment:', appointmentId, updates);
      await updateAppointment.mutateAsync({ appointmentId, updates });
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
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
    a.download = `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <LazyDashboard 
      appointments={appointments} 
      stats={stats} 
      loggedInClinic={loggedInClinic}
    />
  );
};
