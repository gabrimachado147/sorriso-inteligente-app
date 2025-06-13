
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { animations } from "@/lib/animations";
import { MapPin } from "lucide-react";

interface LocationsPageHeaderProps {
  filteredClinicsCount: number;
}

export const LocationsPageHeader: React.FC<LocationsPageHeaderProps> = ({ filteredClinicsCount }) => {
  return (
    <div className={`${animations.fadeIn} flex items-center justify-between`}>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" />
          Unidades Senhor Sorriso
        </h1>
        <p className="text-gray-600 mt-1">Encontre a unidade mais próxima de você</p>
      </div>
      <Badge variant="secondary" className="text-sm">
        {filteredClinicsCount} unidades encontradas
      </Badge>
    </div>
  );
};
