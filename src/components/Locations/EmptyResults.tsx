
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/components/ui/filters";
import { animations } from "@/lib/animations";
import { MapPin } from "lucide-react";

interface EmptyResultsProps {
  onClearFilters: () => void;
}

export const EmptyResults: React.FC<EmptyResultsProps> = ({ onClearFilters }) => {
  return (
    <Card className={`${animations.fadeIn} text-center py-12`}>
      <CardContent>
        <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Nenhuma unidade encontrada
        </h3>
        <p className="text-gray-500 mb-4">
          Tente ajustar os filtros de busca ou pesquise por outra região.
        </p>
        <Button 
          variant="outline"
          onClick={onClearFilters}
          className={animations.buttonHover}
        >
          Limpar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};
