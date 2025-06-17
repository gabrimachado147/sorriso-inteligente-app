
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 truncate">
              Dashboard - {clinicName.charAt(0).toUpperCase() + clinicName.slice(1)}
            </h1>
            <p className="text-sm md:text-base text-gray-600 truncate">
              Gestão avançada de agendamentos da sua unidade
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <RealtimeNotifications clinicName={clinicName} />
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
