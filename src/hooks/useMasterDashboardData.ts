
import { useMemo } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';

export const useMasterDashboardData = (filteredAppointments: AppointmentRecord[]) => {
  return useMemo(() => {
    if (!filteredAppointments || filteredAppointments.length === 0) {
      return {
        totalAppointments: 0,
        totalClinics: 0,
        totalRevenue: 0,
        conversionRate: 0,
        clinicStats: [],
        monthlyTrend: [],
        serviceDistribution: [],
        statusBreakdown: []
      };
    }

    // Estatísticas básicas
    const totalAppointments = filteredAppointments.length;
    const uniqueClinics = new Set(filteredAppointments.map(apt => apt.clinic));
    const totalClinics = uniqueClinics.size;
    
    // Receita total correta
    const totalRevenue = filteredAppointments.reduce((total, apt) => {
      const price = apt.price || 0;
      return total + price;
    }, 0);

    // Taxa de conversão
    const confirmedAppointments = filteredAppointments.filter(apt => 
      apt.status === 'confirmed' || apt.status === 'completed'
    );
    const conversionRate = totalAppointments > 0 ? 
      Math.round((confirmedAppointments.length / totalAppointments) * 100) : 0;

    // Estatísticas por clínica
    const clinicStats = Array.from(uniqueClinics).map(clinic => {
      const clinicAppointments = filteredAppointments.filter(apt => apt.clinic === clinic);
      const confirmed = clinicAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed');
      const revenue = clinicAppointments.reduce((total, apt) => total + (apt.price || 0), 0);
      
      return {
        name: clinic,
        appointments: clinicAppointments.length,
        confirmed: confirmed.length,
        revenue,
        conversionRate: clinicAppointments.length > 0 ? 
          Math.round((confirmed.length / clinicAppointments.length) * 100) : 0
      };
    }).sort((a, b) => b.appointments - a.appointments);

    // Tendência mensal dos últimos 6 meses
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthAppointments = filteredAppointments.filter(apt => 
        apt.created_at.startsWith(monthStr)
      );

      monthlyTrend.push({
        month: monthName,
        agendamentos: monthAppointments.length,
        conversoes: monthAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length,
        receita: monthAppointments.reduce((total, apt) => total + (apt.price || 0), 0)
      });
    }

    // Distribuição de serviços
    const serviceStats = filteredAppointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const serviceDistribution = Object.entries(serviceStats)
      .map(([service, count], index) => ({
        name: service,
        value: count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Quebra por status
    const statusStats = filteredAppointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusBreakdown = [
      { name: 'Confirmados', value: statusStats.confirmed || 0, color: '#10b981' },
      { name: 'Pendentes', value: statusStats.pending || 0, color: '#f59e0b' },
      { name: 'Cancelados', value: statusStats.cancelled || 0, color: '#ef4444' },
      { name: 'Concluídos', value: statusStats.completed || 0, color: '#3b82f6' },
      { name: 'No Show', value: statusStats.no_show || 0, color: '#6b7280' }
    ].filter(item => item.value > 0);

    return {
      totalAppointments,
      totalClinics,
      totalRevenue,
      conversionRate,
      clinicStats,
      monthlyTrend,
      serviceDistribution,
      statusBreakdown
    };
  }, [filteredAppointments]);
};
