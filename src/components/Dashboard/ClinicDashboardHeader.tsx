
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
  return (
    <div className={`${animations.fadeIn} w-full`}>
      {/* Título centralizado com sino posicionado no canto superior direito */}
      <div className="relative mb-6">
        {/* Sino de notificação posicionado no canto superior direito */}
        <div className="absolute top-0 right-0 z-10">
          <RealtimeNotifications clinicName={clinicName} />
        </div>
        
        {/* Título centralizado */}
        <div className="text-center px-12">
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
