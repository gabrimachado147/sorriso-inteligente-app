
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="overflow-hidden w-full">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-2 md:p-3 pointer-events-auto w-full overflow-hidden", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full overflow-hidden",
          month: "space-y-4 w-full overflow-hidden",
          caption: "flex justify-center pt-1 relative items-center mb-2 overflow-hidden",
          caption_label: "text-xs md:text-sm font-medium truncate",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-6 w-6 md:h-7 md:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex-shrink-0"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse overflow-hidden",
          head_row: "flex w-full overflow-hidden",
          head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.6rem] md:text-xs text-center p-0.5 min-w-0 overflow-hidden truncate",
          row: "flex w-full mt-1 overflow-hidden",
          cell: "flex-1 text-center text-[0.6rem] md:text-xs p-0.5 relative focus-within:relative focus-within:z-20 min-w-0 overflow-hidden",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-6 w-full md:h-7 md:w-7 p-0 font-normal aria-selected:opacity-100 text-[0.6rem] md:text-xs flex items-center justify-center min-w-0 max-w-full overflow-hidden truncate"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />,
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
