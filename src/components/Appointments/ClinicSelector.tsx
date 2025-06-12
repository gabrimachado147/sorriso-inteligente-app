
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';

interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface ClinicSelectorProps {
  selectedClinic: string;
  onClinicSelect: (clinicId: string) => void;
  filteredClinics: Clinic[];
}

export const ClinicSelector: React.FC<ClinicSelectorProps> = ({
  selectedClinic,
  onClinicSelect,
  filteredClinics
}) => {
  return (
    <Card className={`${animations.fadeIn} ${animations.cardHover}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Escolher Clínica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredClinics.map((clinic) => (
            <Button
              key={clinic.id}
              variant={selectedClinic === clinic.id ? "default" : "outline"}
              className={`h-auto p-4 ${animations.buttonHover} ${
                selectedClinic === clinic.id ? animations.scaleIn : ''
              }`}
              onClick={() => onClinicSelect(clinic.id)}
            >
              <div className="text-center">
                <MapPin className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">{clinic.name}</p>
                <p className="text-xs text-muted-foreground">{clinic.city} - {clinic.state}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
