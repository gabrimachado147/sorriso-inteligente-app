
import React from 'react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { BrandedDashboardHeader } from './BrandedDashboardHeader';
import { StrategicKPISection } from './StrategicKPISection';
import { QuickActionsCTA } from './QuickActionsCTA';
import { animations } from '@/lib/animations';

interface AdminDashboardProps {
  appointments: AppointmentRecord[];
  stats: Record<string, number>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  appointments, 
  stats 
}) => {
  const loggedInClinic = sessionStorage.getItem('staffClinic') || 'clínica';
  
  // Calcular KPIs estratégicos
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today).length;
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length;
  const conversionRate = appointments.length > 0 ? Math.round((confirmedAppointments / appointments.length) * 100) : 0;
  const totalRevenue = appointments.reduce((total, apt) => total + (apt.price || 0), 0);
  
  // Contar mensagens urgentes (simulado)
  const urgentMessagesCount = Math.floor(Math.random() * 3);

  const handleNavigateToAppointments = () => {
    // Implementar navegação para agendamentos
    console.log('Navegando para agendamentos...');
  };

  const handleNavigateToPatients = () => {
    // Implementar navegação para pacientes
    console.log('Navegando para pacientes...');
  };

  const handleNavigateToReports = () => {
    // Implementar navegação para relatórios
    console.log('Navegando para relatórios...');
  };

  const handleNavigateToMessages = () => {
    // Implementar navegação para mensagens
    console.log('Navegando para mensagens...');
  };

  return (
    <div className={`space-y-8 ${animations.pageEnter}`}>
      {/* Header com Branding */}
      <BrandedDashboardHeader 
        clinicName={loggedInClinic}
        userName="Administrador"
      />

      {/* KPIs Estratégicos */}
      <StrategicKPISection
        totalAppointments={appointments.length}
        conversionRate={conversionRate}
        totalRevenue={totalRevenue}
        todayAppointments={todayAppointments}
      />

      {/* Ações Rápidas com CTAs */}
      <QuickActionsCTA
        onNavigateToAppointments={handleNavigateToAppointments}
        onNavigateToPatients={handleNavigateToPatients}
        onNavigateToReports={handleNavigateToReports}
        onNavigateToMessages={handleNavigateToMessages}
        urgentCount={urgentMessagesCount}
      />
    </div>
  );
};
