
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { animations } from '@/lib/animations';
import { RealtimeNotifications } from './RealtimeNotifications';
import { DashboardFilters } from './DashboardFilters';

interface ClinicDashboardHeaderProps {
  clinicName: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  onExportData: () => void;
  onRefresh: () => void;
}

export const ClinicDashboardHeader: React.FC<ClinicDashboardHeaderProps> = ({
  clinicName,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  periodFilter,
  setPeriodFilter,
  onExportData,
  onRefresh
}) => {
  // Sample notifications for the clinic
  const sampleNotifications = [
    {
      id: '1',
      type: 'info' as const,
      title: 'Novo agendamento',
      message: 'Novo agendamento confirmado para hoje às 14:00',
      timestamp: new Date(),
      read: false
    }
  ];

  return (
    <div className={`${animations.fadeIn} w-full`}>
      {/* Header com sino de notificação */}
      <div className="flex items-center justify-between mb-6">
        <div></div> {/* Espaço vazio para balanceamento */}
        <div className="flex-shrink-0">
          <RealtimeNotifications
            notifications={sampleNotifications}
            onMarkAsRead={() => {}}
            onMarkAllAsRead={() => {}}
            onDismiss={() => {}}
          />
        </div>
      </div>

      {/* Título centralizado */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">
            Dashboard - {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)}
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Gestão avançada de agendamentos da sua unidade
        </p>
      </div>

      <DashboardFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        onExportData={onExportData}
        onRefresh={onRefresh}
      />
    </div>
  );
};
