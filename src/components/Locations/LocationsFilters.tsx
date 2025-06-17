
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterState } from "@/components/ui/filters";
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
    <Card className={`${animations.slideInBottom} ${animations.cardHover} max-w-2xl mx-auto`}>
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Filtrar Unidades</CardTitle>
      </CardHeader>
      <CardContent className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-filter" className="text-sm font-medium">
              Filtrar por Serviço
            </Label>
            <Select
              value={filters.service}
              onValueChange={(value) => onFiltersChange({ ...filters, service: value })}
            >
              <SelectTrigger id="service-filter" className="w-full">
                <SelectValue placeholder="Todos os serviços" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os serviços</SelectItem>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
