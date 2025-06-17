
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
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
    <div className="w-full max-w-full overflow-hidden flex justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        locale={ptBR}
        disabled={(date) => date < new Date() || date.getDay() === 0}
        className="rounded-md border bg-white shadow-sm"
        classNames={{
          months: "flex w-full flex-col space-y-4 flex-1",
          month: "space-y-4 w-full flex flex-col",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell: "text-muted-foreground rounded-md flex-1 font-medium text-sm text-center p-2 min-w-0",
          row: "flex w-full mt-2",
          cell: "flex-1 text-center p-1 relative focus-within:relative focus-within:z-20 min-w-0",
          day: "h-10 w-full p-0 font-medium aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground text-sm flex items-center justify-center min-w-0 transition-colors",
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-bold border-2 border-primary/30",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          caption: "flex justify-center pt-1 relative items-center mb-3",
          caption_label: "text-base font-semibold",
          nav: "space-x-1 flex items-center",
          nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md flex items-center justify-center flex-shrink-0 transition-opacity",
          nav_button_previous: "absolute left-2",
          nav_button_next: "absolute right-2"
        }}
      />
    </div>
  );
};
