import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { UseFormReturn, Path, PathValue } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DatePickerFormEleProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  calendarClassName?: string;
  dateFormat?: string;
  fromYear?: number;
  toYear?: number;
  readOnly?: boolean;
}

export function DatePickerFormEle<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder = "Pick a date",
  className,
  labelClassName,
  calendarClassName,
  dateFormat = "dd/MM/yyyy",
  fromYear,
  toYear,
  readOnly = false,
}: DatePickerFormEleProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger disabled={readOnly} asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    readOnly && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {field.value ? (
                    format(field.value, dateFormat)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  // Set the selected date
                  form.setValue(name, date as PathValue<T, Path<T>>);
                  // Clear the error for this field
                  form.clearErrors(name);
                }}
                initialFocus
                className={calendarClassName}
                fromYear={fromYear}
                toYear={toYear}
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
}

export default DatePickerFormEle;
