
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filters, FilterState } from "@/components/ui/filters";
import { animations } from "@/lib/animations";

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
  return (
    <Card className={`${animations.slideInBottom} ${animations.cardHover}`}>
      <CardHeader>
        <CardTitle className="text-lg">Filtrar Unidades</CardTitle>
      </CardHeader>
      <CardContent>
        <Filters
          filters={filters}
          onFiltersChange={onFiltersChange}
          availableServices={availableServices}
          placeholder="Buscar por nome, endereço, cidade ou estado..."
          showDateFilter={false}
          showClinicFilter={false}
          showStatusFilter={false}
        />
      </CardContent>
    </Card>
  );
};
