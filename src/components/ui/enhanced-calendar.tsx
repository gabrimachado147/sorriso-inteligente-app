
import * as React from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { DayPicker, type DayPickerSingleProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { animations } from "@/lib/animations";

export type EnhancedCalendarProps = DayPickerSingleProps & {
  availableSlots?: Record<string, number>;
  popularDays?: string[];
  busyDays?: string[];
  onDateSelect?: (date: Date | undefined) => void;
};

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  availableSlots = {},
  popularDays = [],
  busyDays = [],
  onDateSelect,
  selected,
  onSelect,
  ...props
}: EnhancedCalendarProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (onSelect) {
      onSelect(date);
    }
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (busyDays.includes(dateStr)) return 'busy';
    if (popularDays.includes(dateStr)) return 'popular';
    if (availableSlots[dateStr] > 0) return 'available';
    return 'normal';
  };

  const getDayClasses = (date: Date) => {
    const status = getDayStatus(date);
    const baseClasses = "relative overflow-hidden";
    
    switch (status) {
      case 'busy':
        return cn(baseClasses, "bg-red-100 text-red-800 hover:bg-red-200");
      case 'popular':
        return cn(baseClasses, "bg-blue-100 text-blue-800 hover:bg-blue-200 ring-1 ring-blue-300");
      case 'available':
        return cn(baseClasses, "bg-green-100 text-green-800 hover:bg-green-200");
      default:
        return baseClasses;
    }
  };

  const renderDaySlots = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const slots = availableSlots[dateStr];
    
    if (!slots || slots === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 text-xs bg-primary/90 text-white px-1 py-0.5 text-center">
        {slots} slot{slots > 1 ? 's' : ''}
      </div>
    );
  };

  return (
    <div className={cn(animations.calendar, "p-3")}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        selected={selected}
        onSelect={handleDateSelect}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-lg font-semibold text-primary",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 transition-all duration-200"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-10 font-medium text-sm",
          row: "flex w-full mt-2",
          cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100 transition-all duration-200 hover:scale-105"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-bold ring-2 ring-primary/30",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
          Day: ({ date, ...dayProps }) => {
            const dayClasses = getDayClasses(date);
            return (
              <div className={cn("relative", dayClasses)}>
                <button {...dayProps} className={cn("w-full h-full", dayProps.className)}>
                  {date.getDate()}
                  {renderDaySlots(date)}
                </button>
              </div>
            );
          },
        }}
        {...props}
      />
      
      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Popular</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-primary" />
          <span>Horários disponíveis</span>
        </div>
      </div>
    </div>
  );
}

EnhancedCalendar.displayName = "EnhancedCalendar";

export { EnhancedCalendar };
