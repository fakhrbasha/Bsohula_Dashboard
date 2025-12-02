"use client";
import type { UseFormReturn, Path, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFormEleProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  disabled?: boolean;
  isMulti?:boolean
}

function SelectFormEle<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  className,
  labelClassName,
  selectClassName,
  disabled,
  isMulti = false,
}: SelectFormEleProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && (
            <FormLabel className={cn("text-sm font-medium", labelClassName)}>
              {label}
            </FormLabel>
          )}
         
         {isMulti ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  className={cn("w-full justify-between", selectClassName)}
                >
                  {field.value?.length
                    ? options
                        .filter((opt) => field.value.includes(opt.value))
                        .map((opt) => opt.label)
                        .join(", ")
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-h-[250px] p-0">
                <Command>
                  <CommandGroup>
                    {options.map((option) => {
                      const isChecked = field.value?.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const newValue = isChecked
                              ? field.value.filter((v: string) => v !== option.value)
                              : [...(field.value || []), option.value];

                            field.onChange(newValue);
                            form.trigger(name);
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            className="mr-2"
                          />
                          {option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <FormControl>
              <select
                disabled={disabled}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger(name);
                }}
                className={cn(
                  "w-full border rounded px-3 py-2 text-sm bg-background",
                  selectClassName
                )}
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormControl>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectFormEle;
