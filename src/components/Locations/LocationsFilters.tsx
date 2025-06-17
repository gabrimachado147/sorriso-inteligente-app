
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { animations } from "@/lib/animations";
import { FilterState } from "@/components/ui/filters";

interface Service {
  id: string;
  name: string;
}

interface LocationsFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableServices: Service[];
}

export const LocationsFilters: React.FC<LocationsFiltersProps> = ({
  filters,
  onFiltersChange,
  availableServices
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleServiceChange = (value: string) => {
    // Se o valor for "all", definimos como string vazia
    const serviceValue = value === "all" ? "" : value;
    onFiltersChange({ ...filters, service: serviceValue });
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

  const hasActiveFilters = filters.search || filters.service;

  return (
    <Card className={`${animations.fadeIn} mb-6`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Linha superior: Busca e Filtro de Serviço */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Campo de busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por clínica, cidade ou endereço..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro de Serviço */}
            <div className="sm:w-64">
              <Select 
                value={filters.service || "all"} 
                onValueChange={handleServiceChange}
              >
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por serviço" />
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

            {/* Botão de limpar filtros */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>

          {/* Indicador de filtros ativos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>Filtros ativos:</span>
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Busca: "{filters.search}"
                </span>
              )}
              {filters.service && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Serviço: {availableServices.find(s => s.id === filters.service)?.name}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
