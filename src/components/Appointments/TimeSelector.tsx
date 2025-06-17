
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useTimeSlots } from '@/hooks/useTimeSlots';

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
  const { timeSlots, isWeekend, isClosed } = useTimeSlots(selectedDate);

  return (
    <Card className={`${animations.slideInRight} ${animations.cardHover} w-full`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 mobile-text-lg">
          <Clock className="h-5 w-5" />
          Horários Disponíveis
          {isWeekend && (
            <Badge variant="secondary" className="ml-2 text-xs">Sábado - Até 13:00</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isClosed ? (
          <p className="text-center text-gray-500 py-8 mobile-text-base">
            Não funcionamos aos domingos
          </p>
        ) : timeSlots.length === 0 ? (
          <p className="text-center text-gray-500 py-8 mobile-text-base">
            Selecione uma data para ver os horários
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
