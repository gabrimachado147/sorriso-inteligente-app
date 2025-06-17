
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { PeriodFilter } from './PeriodFilter';

interface MasterDashboardFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedClinic: string;
  setSelectedClinic: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  availableClinics: string[];
  onExportData: () => void;
  onRefresh: () => void;
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
  onRefresh
}) => {
  return (
    <Card className="mb-6 border-blue-200">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as Clínicas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Clínicas</SelectItem>
              {availableClinics.map((clinic) => (
                <SelectItem key={clinic} value={clinic}>
                  {clinic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Atualizar</span>
            </Button>
            <Button variant="outline" onClick={onExportData} size="sm">
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Exportar</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="Selecionar data específica"
            />
          </div>
          
          <div>
            <PeriodFilter 
              value={periodFilter} 
              onChange={setPeriodFilter}
              className="w-full"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedClinic('all');
              setSelectedStatus('all');
              setSelectedDate('');
              setPeriodFilter('all');
              setSearchTerm('');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
