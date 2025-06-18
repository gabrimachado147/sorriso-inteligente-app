
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { InteractiveFeedback } from '@/components/ui/interactive-feedback';

interface EnhancedDatePickerProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const EnhancedDatePicker: React.FC<EnhancedDatePickerProps> = ({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(date);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${animations.scaleIn}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className={animations.buttonHover}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className={animations.buttonHover}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const disabled = isDateDisabled(day);
            const selected = isSelectedDate(day);
            
            return (
              <InteractiveFeedback key={day} feedbackType="scale">
                <Button
                  variant={selected ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleDateClick(day)}
                  disabled={disabled}
                  className={`w-full h-10 p-0 ${
                    selected 
                      ? 'bg-primary text-white shadow-md' 
                      : disabled 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  } transition-all duration-200`}
                >
                  {day}
                </Button>
              </InteractiveFeedback>
            );
          })}
        </div>

        {/* Selected date display */}
        {selectedDate && (
          <div className={`mt-4 text-center p-3 bg-primary/5 rounded-lg ${animations.fadeIn}`}>
            <p className="text-sm text-gray-600">Data selecionada:</p>
            <p className="font-semibold text-primary">
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
