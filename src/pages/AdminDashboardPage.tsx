
import React from 'react';
import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { RealtimeIndicator } from '@/components/Dashboard/RealtimeIndicator';

const AdminDashboardPage = () => {
  const { realtimeConnected } = useRealtimeAppointments();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">Gerencie agendamentos e monitore atividades</p>
        </div>
        <RealtimeIndicator connected={realtimeConnected} />
      </div>
      
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
