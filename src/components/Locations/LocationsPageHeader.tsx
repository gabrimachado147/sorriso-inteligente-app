
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { animations } from "@/lib/animations";
import { MapPin } from "lucide-react";

interface LocationsPageHeaderProps {
  filteredClinicsCount: number;
}

export const LocationsPageHeader: React.FC<LocationsPageHeaderProps> = ({ filteredClinicsCount }) => {
  return (
    <div className={`${animations.fadeIn} flex flex-col items-center justify-center text-center`}>
      <div>
        <h2 className="text-lg font-bold flex items-center justify-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Unidades Senhor Sorriso
        </h2>
        <p className="text-gray-700 mt-1">Encontre a unidade mais próxima de você</p>
      </div>
      <Badge variant="secondary" className="text-sm bg-gray-100 text-gray-800 mt-2">
        {filteredClinicsCount} unidades encontradas
      </Badge>
    </div>
  );
};
