import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface DateSectionProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DateSection({ selectedDate, onDateChange }: DateSectionProps) {
  const timeZone = 'Australia/Sydney';

  useEffect(() => {
    // Set today's date as default when component mounts and no date is selected
    if (!selectedDate) {
      const today = new Date();
      const sydneyDate = fromZonedTime(today, timeZone);
      onDateChange(sydneyDate);
    }
  }, [selectedDate, onDateChange]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Convert the local date to UTC while preserving the selected date in Sydney timezone
      const sydneyDate = fromZonedTime(date, timeZone);
      onDateChange(sydneyDate);
    } else {
      onDateChange(undefined);
    }
  };

  const displayDate = selectedDate 
    ? toZonedTime(selectedDate, timeZone)
    : undefined;

  return (
    <div className="space-y-4">
      <Label htmlFor="date">Date (AEST)</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white text-black",
              !displayDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate ? format(displayDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}