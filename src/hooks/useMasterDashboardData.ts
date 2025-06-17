
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
    
    // Receita total corrigida - usando apenas agendamentos com preço válido
    const totalRevenue = filteredAppointments.reduce((total, apt) => {
      const price = apt.price && apt.price > 0 ? apt.price : 0;
      return total + price;
    }, 0);

    // Taxa de conversão
    const confirmedAppointments = filteredAppointments.filter(apt => 
      apt.status === 'confirmed' || apt.status === 'completed'
    );
    const conversionRate = totalAppointments > 0 ? 
      Math.round((confirmedAppointments.length / totalAppointments) * 100) : 0;

    // Estatísticas por clínica - dados corrigidos
    const clinicStats = Array.from(uniqueClinics).map(clinic => {
      const clinicAppointments = filteredAppointments.filter(apt => apt.clinic === clinic);
      const confirmed = clinicAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed');
      const revenue = clinicAppointments.reduce((total, apt) => {
        const price = apt.price && apt.price > 0 ? apt.price : 0;
        return total + price;
      }, 0);
      
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

      const monthRevenue = monthAppointments.reduce((total, apt) => {
        const price = apt.price && apt.price > 0 ? apt.price : 0;
        return total + price;
      }, 0);

      monthlyTrend.push({
        month: monthName,
        agendamentos: monthAppointments.length,
        conversoes: monthAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length,
        receita: monthRevenue
      });
    }

    // Distribuição de serviços - nomes completos e melhor organização
    const serviceStats = filteredAppointments.reduce((acc, apt) => {
      // Normalizar nomes de serviços para evitar duplicatas
      const serviceName = apt.service.trim();
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const serviceDistribution = Object.entries(serviceStats)
      .map(([service, count], index) => ({
        name: service,
        value: count,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'][index % 8]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Limitar a 8 serviços principais

    // Quebra por status - dados mais organizados
    const statusStats = filteredAppointments.reduce((acc, apt) => {
      const status = apt.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusBreakdown = [
      { name: 'Confirmados', value: statusStats.confirmed || 0, color: '#10b981' },
      { name: 'Concluídos', value: statusStats.completed || 0, color: '#3b82f6' },
      { name: 'Pendentes', value: statusStats.pending || 0, color: '#f59e0b' },
      { name: 'Cancelados', value: statusStats.cancelled || 0, color: '#ef4444' },
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
