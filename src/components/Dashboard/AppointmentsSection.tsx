
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Clock } from 'lucide-react';

interface AppointmentsSectionProps {
  onReschedule: () => void;
  onViewAllAppointments: () => void;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  onReschedule,
  onViewAllAppointments
}) => {
  return (
    <Card className={animations.slideInRight}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Próximas Consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}>
            <div>
              <p className="font-medium">Limpeza Dental</p>
              <p className="text-sm text-gray-600">Campo Belo - Dr. Silva</p>
              <p className="text-xs text-gray-500">15/06/2024 às 14:00</p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onReschedule}
              className={animations.buttonHover}
            >
              Remarcar
            </Button>
          </div>
          
          <div className="text-center py-4">
            <Button 
              variant="ghost" 
              className={`text-primary ${animations.buttonHover}`}
              onClick={onViewAllAppointments}
            >
              Ver todas as consultas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
