
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
    <div className="w-full max-w-full overflow-hidden">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        locale={ptBR}
        disabled={(date) => date < new Date() || date.getDay() === 0}
        className="rounded-md border w-full bg-white shadow-sm overflow-hidden"
        classNames={{
          months: "flex w-full flex-col space-y-4 flex-1 overflow-hidden",
          month: "space-y-4 w-full flex flex-col overflow-hidden",
          table: "w-full border-collapse table-fixed overflow-hidden",
          head_row: "flex w-full",
          head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.65rem] md:text-xs text-center p-1 min-w-0 overflow-hidden",
          row: "flex w-full mt-1",
          cell: "flex-1 text-center text-xs md:text-sm p-0.5 relative focus-within:relative focus-within:z-20 min-w-0 overflow-hidden",
          day: "h-7 md:h-8 w-full p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground text-[0.65rem] md:text-xs flex items-center justify-center min-w-0 max-w-full overflow-hidden",
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          caption: "flex justify-center pt-1 relative items-center mb-2",
          caption_label: "text-sm md:text-base font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-6 w-6 md:h-7 md:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md flex items-center justify-center",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1"
        }}
      />
    </div>
  );
};
