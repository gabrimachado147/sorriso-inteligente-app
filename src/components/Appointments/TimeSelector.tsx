
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate?: Date;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeSelect,
  selectedDate
}) => {
  if (!selectedDate) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="mobile-text-sm">Selecione uma data primeiro</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 overflow-hidden">
        {timeSlots.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? 'default' : 'outline'}
            onClick={() => onTimeSelect(time)}
            className="mobile-button-sm text-xs md:text-sm truncate overflow-hidden"
            size="sm"
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};
