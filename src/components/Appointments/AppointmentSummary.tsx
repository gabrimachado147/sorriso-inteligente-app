
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, Stethoscope, User } from 'lucide-react';
import { animations } from '@/lib/animations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface Service {
  id: string;
  name: string;
}

interface AppointmentSummaryProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedClinic: string;
  selectedService: string;
  availableClinics: Clinic[];
  availableServices: Service[];
  onConfirm: () => void;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  selectedDate,
  selectedTime,
  selectedClinic,
  selectedService,
  availableClinics,
  availableServices,
  onConfirm
}) => {
  if (!selectedDate && !selectedTime && !selectedClinic && !selectedService) {
    return null;
  }

  return (
    <Card className={`${animations.scaleIn} border-primary/20 bg-primary/5`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <User className="h-5 w-5" />
          Resumo do Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {selectedDate && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Data: {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        )}
        {selectedTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Horário: {selectedTime}</span>
          </div>
        )}
        {selectedClinic && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Clínica: {availableClinics.find(c => c.id === selectedClinic)?.name}</span>
          </div>
        )}
        {selectedService && (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            <span>Serviço: {availableServices.find(s => s.id === selectedService)?.name}</span>
          </div>
        )}
        
        <Button 
          onClick={onConfirm}
          className={`w-full mt-4 ${animations.buttonHover}`}
          disabled={!selectedDate || !selectedTime || !selectedClinic || !selectedService}
        >
          Confirmar Agendamento
        </Button>
      </CardContent>
    </Card>
  );
};
