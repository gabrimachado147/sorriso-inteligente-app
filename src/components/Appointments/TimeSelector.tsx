
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { animations } from '@/lib/animations';

interface TimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onTimeSelect
}) => {
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    
    const dayOfWeek = date.getDay();
    
    // Segunda a Sexta: 8h às 19h
    const weekdaySlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];
    
    // Sábado: 8h às 13h
    const saturdaySlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00'
    ];
    
    // Domingo: fechado
    if (dayOfWeek === 0) {
      return [];
    }
    
    if (dayOfWeek === 6) {
      return saturdaySlots;
    }
    
    return weekdaySlots;
  };

  const timeSlots = getAvailableTimeSlots(selectedDate);

  return (
    <Card className={`${animations.slideInRight} ${animations.cardHover} w-full`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 mobile-text-lg">
          <Clock className="h-5 w-5" />
          Horários Disponíveis
          {selectedDate && selectedDate.getDay() === 6 && (
            <Badge variant="secondary" className="ml-2 text-xs">Sábado - Até 13:00</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeSlots.length === 0 ? (
          <p className="text-center text-gray-500 py-8 mobile-text-base">
            {selectedDate?.getDay() === 0 ? 'Não funcionamos aos domingos' : 'Selecione uma data para ver os horários'}
          </p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={`${animations.buttonHover} ${
                  selectedTime === time ? animations.scaleIn : ''
                } mobile-text-sm mobile-touch-target py-3 px-2 text-center`}
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
