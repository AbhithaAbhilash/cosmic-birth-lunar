import { useState, useMemo } from "react";
import { format, setMonth, setYear, getDaysInMonth } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type Step = "year" | "month" | "day";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const START_YEAR = currentYear - 120;
const YEARS = Array.from({ length: 121 }, (_, i) => currentYear - i);
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface BirthDatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export default function BirthDatePicker({ date, onSelect }: BirthDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("year");
  const [selectedYear, setSelectedYear] = useState<number | null>(date?.getFullYear() ?? null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(date?.getMonth() ?? null);
  const [viewYear, setViewYear] = useState(date?.getFullYear() ?? currentYear);
  const [viewMonth, setViewMonth] = useState(date?.getMonth() ?? new Date().getMonth());

  const today = new Date();

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      if (date) {
        setSelectedYear(date.getFullYear());
        setSelectedMonth(date.getMonth());
        setViewYear(date.getFullYear());
        setViewMonth(date.getMonth());
        setStep("day");
      } else {
        setStep("year");
      }
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setViewYear(year);
    setStep("month");
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setViewMonth(month);
    setStep("day");
  };

  const handleDaySelect = (day: number) => {
    if (selectedYear == null || selectedMonth == null) return;
    const newDate = new Date(selectedYear, selectedMonth, day);
    if (newDate > today) return;
    onSelect(newDate);
    setOpen(false);
  };

  const isFutureMonth = (month: number) => {
    if (selectedYear == null) return false;
    if (selectedYear < currentYear) return false;
    return month > today.getMonth();
  };

  const calendarDays = useMemo(() => {
    if (viewYear == null) return [];
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = getDaysInMonth(new Date(viewYear, viewMonth));
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return days;
  }, [viewYear, viewMonth]);

  const isDayDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d > today;
  };

  const isDaySelected = (day: number) => {
    if (!date) return false;
    return date.getFullYear() === viewYear && date.getMonth() === viewMonth && date.getDate() === day;
  };

  const navigateMonth = (dir: number) => {
    let newMonth = viewMonth + dir;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newYear > currentYear || (newYear === currentYear && newMonth > today.getMonth())) return;
    if (newYear < START_YEAR) return;
    setViewMonth(newMonth);
    setViewYear(newYear);
    setSelectedYear(newYear);
    setSelectedMonth(newMonth);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-body h-12 bg-card border-border hover:bg-muted hover:border-primary/50 transition-all duration-300",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {date ? format(date, "MMMM d, yyyy") : "Select your birth date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-card border-border pointer-events-auto" align="center">
        {/* Year Selection */}
        {step === "year" && (
          <div className="p-3">
            <p className="text-center text-sm font-body text-muted-foreground mb-2">Select Year</p>
            <ScrollArea className="h-[280px]">
              <div className="grid grid-cols-4 gap-1.5 p-1">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      "h-9 rounded-md text-sm font-body transition-colors",
                      "hover:bg-primary/20 hover:text-foreground",
                      selectedYear === year
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Month Selection */}
        {step === "month" && (
          <div className="p-3">
            <button
              onClick={() => setStep("year")}
              className="text-sm font-body text-primary hover:text-foreground transition-colors mb-2 flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              {selectedYear}
            </button>
            <p className="text-center text-sm font-body text-muted-foreground mb-2">Select Month</p>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((month, i) => (
                <button
                  key={month}
                  onClick={() => !isFutureMonth(i) && handleMonthSelect(i)}
                  disabled={isFutureMonth(i)}
                  className={cn(
                    "h-10 rounded-md text-sm font-body transition-colors",
                    "hover:bg-primary/20 hover:text-foreground",
                    isFutureMonth(i) && "opacity-30 cursor-not-allowed hover:bg-transparent",
                    selectedMonth === i
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Day Selection */}
        {step === "day" && (
          <div className="p-3">
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigateMonth(-1)}
                className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep("month")}
                className="text-sm font-body text-foreground hover:text-primary transition-colors"
              >
                {MONTHS[viewMonth]} {viewYear}
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="h-8 flex items-center justify-center text-xs text-muted-foreground font-body">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => (
                <div key={i} className="h-9 flex items-center justify-center">
                  {day != null && (
                    <button
                      onClick={() => handleDaySelect(day)}
                      disabled={isDayDisabled(day)}
                      className={cn(
                        "h-8 w-8 rounded-md text-sm font-body transition-colors",
                        "hover:bg-primary/20 hover:text-foreground",
                        isDayDisabled(day) && "opacity-30 cursor-not-allowed hover:bg-transparent",
                        isDaySelected(day)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
