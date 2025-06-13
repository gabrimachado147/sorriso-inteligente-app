
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { MapPin } from 'lucide-react';

interface UnitsSectionProps {
  onViewUnits: () => void;
  onScheduleClinic: (clinic: string, phone: string) => void;
}

export const UnitsSection: React.FC<UnitsSectionProps> = ({
  onViewUnits,
  onScheduleClinic
}) => {
  return (
    <Card className={animations.slideInLeft}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Nossas Unidades
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onViewUnits}
            className={animations.buttonHover}
          >
            Ver todas
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Campo Belo - MG</p>
                <p className="text-sm text-gray-600">Av. Afonso Pena, 151</p>
                <p className="text-xs text-gray-500">(31) 97114-7487</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScheduleClinic('Campo Belo', '(31) 97114-7487')}
                className={animations.buttonHover}
              >
                Agendar
              </Button>
            </div>
          </div>
          
          <div className={`p-3 bg-green-50 rounded-lg ${animations.cardHover}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Formiga - MG</p>
                <p className="text-sm text-gray-600">R. Barão de Piumhy, 198</p>
                <p className="text-xs text-gray-500">(31) 97114-7487</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScheduleClinic('Formiga', '(31) 97114-7487')}
                className={animations.buttonHover}
              >
                Agendar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
