
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';

interface UnitsSectionProps {
  onViewUnits: () => void;
  onScheduleClinic: (clinic: string, phone: string) => void;
}

export const UnitsSection: React.FC<UnitsSectionProps> = ({
  onViewUnits,
  onScheduleClinic
}) => {
  const featuredClinics = [
    {
      name: 'Campo Belo - MG',
      address: 'Av. Afonso Pena, 151, Centro',
      phone: '(35) 99891-3803'
    },
    {
      name: 'Formiga - MG', 
      address: 'R. Barão de Piumhy, 198, Centro',
      phone: '(37) 3443-0520'
    }
  ];

  return (
    <Card className={animations.slideInLeft}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Nossas Unidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {featuredClinics.map((clinic) => (
            <div key={clinic.name} className={`p-3 border rounded-lg ${animations.cardHover}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{clinic.name}</h4>
                  <p className="text-sm text-gray-600">{clinic.address}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onScheduleClinic(clinic.name, clinic.phone)}
                  className={animations.buttonHover}
                >
                  Agendar
                </Button>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              className={`text-primary ${animations.buttonHover}`}
              onClick={onViewUnits}
            >
              Ver todas as unidades
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
