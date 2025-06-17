import React, { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { useAppointmentsFilters } from '@/hooks/useAppointmentsFilters';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { animations } from '@/lib/animations';
import { StaffLogin } from '@/components/Auth/StaffLogin';
import { AppointmentsTable } from '@/components/Appointments/AppointmentsTable';
import { AppointmentsFilters } from '@/components/Appointments/AppointmentsFilters';
import { AppointmentsStats } from '@/components/Appointments/AppointmentsStats';
import { AppointmentsHeader } from '@/components/Appointments/AppointmentsHeader';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AppointmentsPage = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem('staff_logged_in')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const { appointments, isLoading, stats, statsLoading, updateAppointmentStatus, updateAppointmentService, deleteAppointment } = useAppointments();

  const { filteredAppointments, availableClinics, userClinicName } = useAppointmentsFilters({
    appointments,
    loggedInUser,
    searchTerm,
    selectedClinic,
    selectedStatus,
    selectedDate
  });

  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    localStorage.setItem('staff_logged_in', username);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('staff_logged_in');
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => {
    updateAppointmentStatus.mutate({ appointmentId, status: newStatus });
  };

  const handleServiceUpdate = (appointmentId: string, service: string, price?: number) => {
    updateAppointmentService.mutate({ appointmentId, service, price });
  };

  const handleDelete = (appointmentId: string) => {
    deleteAppointment.mutate(appointmentId);
  };

  if (!loggedInUser) {
    return <StaffLogin onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <EnhancedSkeleton variant="card" count={3} />
      </div>
    );
  }

  // Convert complex stats to simple Record<string, number> for AdminDashboard
  const simplifiedStats: Record<string, number> = stats ? {
    total: stats.total,
    today: stats.today,
    thisMonth: stats.thisMonth,
    confirmed: stats.confirmed,
    completed: stats.completed,
    cancelled: stats.cancelled
  } : {};

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <AppointmentsHeader
        userClinicName={userClinicName}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="appointments">Gerenciar Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard appointments={appointments} stats={simplifiedStats} />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          {!statsLoading && stats && (
            <AppointmentsStats
              appointments={filteredAppointments}
              isLoading={statsLoading}
            />
          )}

          <AppointmentsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedClinic={selectedClinic}
            onClinicChange={setSelectedClinic}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            clinics={availableClinics}
            totalCount={appointments.length}
            filteredCount={filteredAppointments.length}
          />

          <AppointmentsTable
            appointments={filteredAppointments}
            onStatusChange={handleStatusChange}
            onServiceUpdate={handleServiceUpdate}
            onDelete={handleDelete}
            isUpdating={updateAppointmentStatus.isPending || updateAppointmentService.isPending || deleteAppointment.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
