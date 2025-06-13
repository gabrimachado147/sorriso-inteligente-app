
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

const AppointmentsPage = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    localStorage.getItem('staff_logged_in')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const { appointments, isLoading, stats, statsLoading, updateAppointmentStatus } = useAppointments();

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

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <AppointmentsHeader
        userClinicName={userClinicName}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

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
        isUpdating={updateAppointmentStatus.isPending}
      />
    </div>
  );
};

export default AppointmentsPage;
