
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';
import { animations } from '@/lib/animations';
import { ptBR } from 'date-fns/locale';

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect
}) => {
  return (
    <Card className={`${animations.slideInLeft} ${animations.cardHover}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Selecionar Data
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          locale={ptBR}
          disabled={(date) => date < new Date() || date.getDay() === 0}
          className="rounded-md border w-fit"
        />
      </CardContent>
    </Card>
  );
};
