
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';

interface UnitsSectionProps {
  onViewUnits: () => void;
  onScheduleClinic: (clinicId?: string) => void;
}

export const UnitsSection: React.FC<UnitsSectionProps> = memo(({
  onViewUnits,
  onScheduleClinic
}) => {
  const featuredClinics = [
    {
      id: 'campo-belo',
      name: 'Campo Belo - MG',
      address: 'Av. Afonso Pena, 151, Centro',
      phone: '(35) 99891-3803'
    },
    {
      id: 'formiga',
      name: 'Formiga - MG', 
      address: 'R. Barão de Piumhy, 198, Centro',
      phone: '(37) 3443-0520'
    }
  ];

  return (
    <Card className={animations.slideInLeft}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MapPin className="h-5 w-5 mr-2" />
          Nossas Unidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {featuredClinics.map((clinic) => (
            <div key={clinic.id} className={`p-3 border rounded-lg ${animations.cardHover}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{clinic.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{clinic.address}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onScheduleClinic(clinic.id)}
                  className={`${animations.buttonHover} px-3 py-1 text-xs shrink-0`}
                  aria-label={`Agendar consulta na ${clinic.name}`}
                >
                  Agendar
                </Button>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              className={`text-primary text-sm ${animations.buttonHover}`}
              onClick={onViewUnits}
              aria-label="Ver todas as unidades"
            >
              Ver todas as unidades
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

UnitsSection.displayName = 'UnitsSection';
