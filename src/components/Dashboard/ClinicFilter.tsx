
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';

interface ClinicFilterProps {
  selectedClinic: string;
  onClinicChange: (clinic: string) => void;
  availableClinics: string[];
}

const getClinicDisplayName = (clinic: string) => {
  if (clinic === 'all') return 'Todas as Clínicas';
  return clinic.replace('Senhor Sorriso ', '');
};

export const ClinicFilter: React.FC<ClinicFilterProps> = ({
  selectedClinic,
  onClinicChange,
  availableClinics
}) => {
  return (
    <Card className={animations.fadeIn}>
      <CardHeader>
        <CardTitle>Filtro por Unidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {availableClinics.map((clinic) => (
            <Badge
              key={clinic}
              variant={selectedClinic === clinic ? "default" : "outline"}
              className={`cursor-pointer transition-all ${animations.buttonHover} ${
                selectedClinic === clinic ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onClinicChange(clinic)}
            >
              {getClinicDisplayName(clinic)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
