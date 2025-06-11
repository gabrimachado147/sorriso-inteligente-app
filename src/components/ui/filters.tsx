
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Filter, X, Search, Calendar as CalendarIcon, MapPin, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { animations } from '@/lib/animations';

export interface FilterState {
  search: string;
  clinic: string;
  service: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  status: string;
}

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableClinics?: Array<{ id: string; name: string }>;
  availableServices?: Array<{ id: string; name: string }>;
  availableStatuses?: Array<{ id: string; name: string }>;
  placeholder?: string;
  showDateFilter?: boolean;
  showClinicFilter?: boolean;
  showServiceFilter?: boolean;
  showStatusFilter?: boolean;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  availableClinics = [],
  availableServices = [],
  availableStatuses = [],
  placeholder = "Buscar...",
  showDateFilter = true,
  showClinicFilter = true,
  showServiceFilter = true,
  showStatusFilter = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | Date | undefined) => {
    // Convert "all" back to empty string for filtering logic
    const actualValue = value === "all" ? "" : value;
    onFiltersChange({ ...filters, [key]: actualValue });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      clinic: '',
      service: '',
      dateFrom: undefined,
      dateTo: undefined,
      status: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.search || filters.clinic || filters.service || 
           filters.dateFrom || filters.dateTo || filters.status;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.clinic) count++;
    if (filters.service) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.status) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`relative ${animations.buttonHover}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {getActiveFilterCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-80 ${animations.scaleIn}`} align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros Avançados</h4>
                {hasActiveFilters() && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>

              {/* Filtro por clínica */}
              {showClinicFilter && availableClinics.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Clínica
                  </Label>
                  <Select 
                    value={filters.clinic || "all"} 
                    onValueChange={(value) => updateFilter('clinic', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma clínica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as clínicas</SelectItem>
                      {availableClinics.map((clinic) => (
                        <SelectItem key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtro por serviço */}
              {showServiceFilter && availableServices.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Tipo de Serviço
                  </Label>
                  <Select 
                    value={filters.service || "all"} 
                    onValueChange={(value) => updateFilter('service', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os serviços</SelectItem>
                      {availableServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtro por status */}
              {showStatusFilter && availableStatuses.length > 0 && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={filters.status || "all"} 
                    onValueChange={(value) => updateFilter('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filtro por data */}
              {showDateFilter && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Período
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          {filters.dateFrom ? format(filters.dateFrom, 'dd/MM', { locale: ptBR }) : 'De'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateFrom}
                          onSelect={(date) => updateFilter('dateFrom', date)}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          {filters.dateTo ? format(filters.dateTo, 'dd/MM', { locale: ptBR }) : 'Até'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateTo}
                          onSelect={(date) => updateFilter('dateTo', date)}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtros ativos */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter('search', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.clinic && (
            <Badge variant="secondary" className="gap-1">
              Clínica: {availableClinics.find(c => c.id === filters.clinic)?.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter('clinic', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.service && (
            <Badge variant="secondary" className="gap-1">
              Serviço: {availableServices.find(s => s.id === filters.service)?.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => updateFilter('service', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateFrom && filters.dateTo 
                ? `${format(filters.dateFrom, 'dd/MM')} - ${format(filters.dateTo, 'dd/MM')}`
                : filters.dateFrom 
                  ? `A partir de ${format(filters.dateFrom, 'dd/MM')}`
                  : `Até ${format(filters.dateTo!, 'dd/MM')}`
              }
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  updateFilter('dateFrom', undefined);
                  updateFilter('dateTo', undefined);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
