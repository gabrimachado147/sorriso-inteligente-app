
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, User, CheckCircle } from 'lucide-react';
import { animations } from '@/lib/animations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const isComplete = selectedDate && selectedTime && selectedClinic && selectedService;
  
  const clinic = availableClinics.find(c => c.id === selectedClinic);
  const service = availableServices.find(s => s.id === selectedService);

  if (!isComplete) {
    return (
      <Card className={`${animations.fadeIn} opacity-60 border-dashed`}>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-gray-500">
            <Calendar className="h-5 w-5" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Complete todos os campos acima para ver o resumo do seu agendamento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${animations.slideInBottom} border-l-4 border-l-primary shadow-lg`}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckCircle className="h-6 w-6" />
          Resumo do Agendamento
        </CardTitle>
        <p className="text-sm text-gray-600">Confirme os dados antes de finalizar</p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Data e Horário</p>
                <p className="text-sm text-blue-700">
                  {format(selectedDate!, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                </p>
                <p className="text-sm font-medium text-blue-800">{selectedTime}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Local</p>
                <p className="text-sm text-green-700">
                  {clinic?.name}
                </p>
                <p className="text-xs text-green-600">
                  {clinic?.city}, {clinic?.state}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <User className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-purple-900">Serviço</p>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-purple-700">{service?.name}</p>
                  {service?.price === 'Gratuito' && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Gratuito
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-purple-600">{service?.description}</p>
                <p className="text-xs text-purple-500 mt-1">
                  Duração: {service?.duration} minutos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onConfirm}
              className={`flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 ${animations.buttonHover}`}
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirmar Agendamento
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Após confirmar, você receberá uma mensagem no WhatsApp com os detalhes do agendamento
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
