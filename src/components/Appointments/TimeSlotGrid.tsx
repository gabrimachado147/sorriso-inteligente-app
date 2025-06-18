
import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

interface TimeSlotGridProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate?: Date;
  timeSlots?: TimeSlot[];
}

const defaultTimeSlots: TimeSlot[] = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: false },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: false },
  { time: '11:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: false },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true }
];

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedTime,
  onTimeSelect,
  selectedDate,
  timeSlots = defaultTimeSlots
}) => {
  if (!selectedDate) {
    return (
      <Card className={`w-full ${animations.fadeIn}`}>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Selecione uma data primeiro
          </h3>
          <p className="text-gray-500">
            Escolha uma data para ver os horários disponíveis
          </p>
        </CardContent>
      </Card>
    );
  }

  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12;
  });

  const renderTimeSlots = (slots: TimeSlot[], period: string) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {period}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {slots.map((slot, index) => (
          <InteractiveFeedback key={slot.time} feedbackType="scale">
            <Button
              variant={selectedTime === slot.time ? 'default' : 'outline'}
              size="sm"
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={`w-full h-12 text-sm font-medium transition-all duration-200 ${
                selectedTime === slot.time
                  ? 'bg-primary text-white shadow-md scale-105'
                  : slot.available
                  ? 'hover:bg-primary/10 hover:text-primary hover:border-primary/50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
              } ${animations.buttonHover}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center">
                <span>{slot.time}</span>
                {slot.price && slot.available && (
                  <span className="text-xs opacity-80">
                    R$ {slot.price}
                  </span>
                )}
                {!slot.available && (
                  <span className="text-xs">Ocupado</span>
                )}
              </div>
            </Button>
          </InteractiveFeedback>
        ))}
      </div>
    </div>
  );

  return (
    <Card className={`w-full ${animations.slideInLeft}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Horários Disponíveis
        </CardTitle>
        <p className="text-sm text-gray-600">
          {selectedDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderTimeSlots(morningSlots, 'Manhã')}
        {renderTimeSlots(afternoonSlots, 'Tarde')}
        
        {/* Legend */}
        <div className={`flex items-center justify-center gap-4 text-xs text-gray-500 pt-4 border-t ${animations.fadeIn}`}>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-gray-300 rounded"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Ocupado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
