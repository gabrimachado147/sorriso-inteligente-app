
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';

interface AppointmentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedClinic: string;
  onClinicChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
  clinics: string[];
  totalCount: number;
  filteredCount: number;
}

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'confirmed', label: 'Confirmados' },
  { value: 'cancelled', label: 'Cancelados' },
  { value: 'completed', label: 'Concluídos' },
  { value: 'no_show', label: 'Não Compareceu' }
];

export const AppointmentsFilters: React.FC<AppointmentsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedClinic,
  onClinicChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
  clinics,
  totalCount,
  filteredCount
}) => {
  const clearFilters = () => {
    onSearchChange('');
    onClinicChange('all');
    onStatusChange('all');
    onDateChange('');
  };

  const hasActiveFilters = searchTerm || selectedClinic !== 'all' || selectedStatus !== 'all' || selectedDate;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Filtros</h3>
              {hasActiveFilters && (
                <Badge variant="secondary">
                  {filteredCount} de {totalCount}
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Clínica</Label>
              <Select value={selectedClinic} onValueChange={onClinicChange}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Todas as clínicas" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as clínicas</SelectItem>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic} value={clinic}>
                      {clinic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={onStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
