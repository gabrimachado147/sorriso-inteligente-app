
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, User, CalendarPlus } from 'lucide-react';
import { animations } from '@/lib/animations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';

interface AppointmentSummaryProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedClinic: string;
  selectedService: string;
  availableClinics: Array<{id: string, name: string, city: string, state: string}>;
  availableServices: Array<{id: string, name: string, description: string, duration: number, price: string}>;
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
  const { isSupported: isCalendarSupported, addAppointmentToCalendar } = useCalendarIntegration();
  
  const isComplete = selectedDate && selectedTime && selectedClinic && selectedService;
  
  const clinic = availableClinics.find(c => c.id === selectedClinic);
  const service = availableServices.find(s => s.id === selectedService);

  const handleAddToCalendar = async () => {
    if (!isComplete || !clinic || !service) return;

    const appointmentData = {
      service: service.name,
      clinic: `${clinic.name} - ${clinic.city}`,
      date: format(selectedDate!, 'dd/MM/yyyy', { locale: ptBR }),
      time: selectedTime,
      duration: service.duration
    };

    await addAppointmentToCalendar(appointmentData);
  };

  if (!isComplete) {
    return (
      <Card className={`${animations.fadeIn} opacity-60`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Complete todos os campos para ver o resumo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${animations.slideInUp} border-l-4 border-l-primary`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Resumo do Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Data</p>
                <p className="text-sm text-gray-600">
                  {format(selectedDate!, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Horário</p>
                <p className="text-sm text-gray-600">{selectedTime}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Unidade</p>
                <p className="text-sm text-gray-600">
                  {clinic?.name} - {clinic?.city}, {clinic?.state}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Serviço</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">{service?.name}</p>
                  {service?.price === 'Gratuito' && (
                    <Badge variant="secondary" className="text-xs">
                      Gratuito
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{service?.description}</p>
              </div>
            </div>
          </div>
        </div>

        {service?.duration && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>Duração estimada:</strong> {service.duration} minutos
            </p>
            {service.price !== 'Gratuito' && (
              <p className="text-sm">
                <strong>Valor:</strong> {service.price}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={onConfirm}
            className={`flex-1 ${animations.buttonHover}`}
          >
            Confirmar Agendamento
          </Button>
          
          {isCalendarSupported && (
            <Button
              variant="outline"
              onClick={handleAddToCalendar}
              className={`flex items-center gap-2 ${animations.buttonHover}`}
            >
              <CalendarPlus className="h-4 w-4" />
              Adicionar ao Calendário
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
