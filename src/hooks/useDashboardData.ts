
import { useMemo } from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';

export const useDashboardData = (filteredAppointments: AppointmentRecord[]) => {
  return useMemo(() => {
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
};
