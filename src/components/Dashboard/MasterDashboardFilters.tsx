
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, RefreshCw, MessageSquare } from 'lucide-react';
import { PeriodFilter } from './PeriodFilter';

interface MasterDashboardFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedClinic: string;
  setSelectedClinic: (clinic: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  periodFilter: string;
  setPeriodFilter: (period: string) => void;
  availableClinics: string[];
  onExportData: () => void;
  onRefresh: () => void;
  onShowMessages: () => void;
}

export const MasterDashboardFilters: React.FC<MasterDashboardFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedClinic,
  setSelectedClinic,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  periodFilter,
  setPeriodFilter,
  availableClinics,
  onExportData,
  onRefresh,
  onShowMessages
}) => {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        {/* Primeira linha - Busca e Filtros principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar clínica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as clínicas</SelectItem>
              {availableClinics.map(clinic => (
                <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Filtrar por data"
          />
        </div>

        {/* Segunda linha - Período e Ações */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <PeriodFilter value={periodFilter} onChange={setPeriodFilter} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={onShowMessages}
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Mensagens</span>
            </Button>
            
            <Button 
              onClick={onExportData}
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            
            <Button 
              onClick={onRefresh}
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
