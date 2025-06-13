
import { AppointmentRecord } from './supabase/appointments';

export interface DashboardMetrics {
  totalAppointments: number;
  todayAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  noShowAppointments: number;
  conversionRate: number;
  uniquePatients: number;
  averageAppointmentsPerDay: number;
  topServices: Array<{ service: string; count: number }>;
  topClinics: Array<{ clinic: string; count: number; conversionRate: number }>;
  monthlyTrends: Array<{ month: string; appointments: number; conversions: number }>;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
}

export class AdminDashboardService {
  static calculateMetrics(appointments: AppointmentRecord[]): DashboardMetrics {
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
        uniquePatients: 0,
        averageAppointmentsPerDay: 0,
        topServices: [],
        topClinics: [],
        monthlyTrends: [],
        statusDistribution: []
      };
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Contadores básicos
    const todayAppointments = appointments.filter(apt => apt.date === today).length;
    const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const noShowAppointments = appointments.filter(apt => apt.status === 'no_show').length;
    const pendingAppointments = appointments.filter(apt => 
      !['confirmed', 'cancelled', 'completed', 'no_show'].includes(apt.status)
    ).length;

    // Taxa de conversão
    const successfulAppointments = confirmedAppointments + completedAppointments;
    const conversionRate = appointments.length > 0 ? 
      Math.round((successfulAppointments / appointments.length) * 100) : 0;

    // Pacientes únicos
    const uniquePatients = new Set(appointments.map(apt => apt.phone)).size;

    // Média de agendamentos por dia
    const firstAppointment = appointments.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )[0];
    
    const daysSinceFirst = firstAppointment ? 
      Math.max(1, Math.floor((Date.now() - new Date(firstAppointment.created_at).getTime()) / (1000 * 60 * 60 * 24))) : 1;
    
    const averageAppointmentsPerDay = Math.round(appointments.length / daysSinceFirst);

    // Top serviços
    const serviceStats = appointments.reduce((acc, apt) => {
      acc[apt.service] = (acc[apt.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topServices = Object.entries(serviceStats)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top clínicas com taxa de conversão
    const clinicStats = appointments.reduce((acc, apt) => {
      if (!acc[apt.clinic]) {
        acc[apt.clinic] = { total: 0, successful: 0 };
      }
      acc[apt.clinic].total++;
      if (apt.status === 'confirmed' || apt.status === 'completed') {
        acc[apt.clinic].successful++;
      }
      return acc;
    }, {} as Record<string, { total: number; successful: number }>);

    const topClinics = Object.entries(clinicStats)
      .map(([clinic, data]) => ({
        clinic,
        count: data.total,
        conversionRate: Math.round((data.successful / data.total) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Tendências mensais (últimos 6 meses)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthAppointments = appointments.filter(apt => 
        apt.created_at.startsWith(monthStr)
      );
      const monthConversions = monthAppointments.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'completed'
      );

      monthlyTrends.push({
        month: monthName,
        appointments: monthAppointments.length,
        conversions: monthConversions.length
      });
    }

    // Distribuição de status
    const statusCounts = {
      confirmed: confirmedAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      no_show: noShowAppointments,
      pending: pendingAppointments
    };

    const statusDistribution = Object.entries(statusCounts)
      .map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / appointments.length) * 100)
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      totalAppointments: appointments.length,
      todayAppointments,
      confirmedAppointments,
      cancelledAppointments,
      completedAppointments,
      pendingAppointments,
      noShowAppointments,
      conversionRate,
      uniquePatients,
      averageAppointmentsPerDay,
      topServices,
      topClinics,
      monthlyTrends,
      statusDistribution
    };
  }

  static getRealtimeInsights(appointments: AppointmentRecord[]): string[] {
    const insights: string[] = [];
    const metrics = this.calculateMetrics(appointments);

    if (metrics.conversionRate > 80) {
      insights.push('🎉 Excelente taxa de conversão!');
    } else if (metrics.conversionRate < 60) {
      insights.push('⚠️ Taxa de conversão abaixo do ideal');
    }

    if (metrics.todayAppointments > metrics.averageAppointmentsPerDay) {
      insights.push('📈 Dia acima da média de agendamentos');
    }

    if (metrics.noShowAppointments > metrics.totalAppointments * 0.1) {
      insights.push('👁️ Alto índice de não comparecimento');
    }

    const topService = metrics.topServices[0];
    if (topService && topService.count > metrics.totalAppointments * 0.3) {
      insights.push(`🔥 ${topService.service} é o serviço mais procurado`);
    }

    return insights;
  }
}
