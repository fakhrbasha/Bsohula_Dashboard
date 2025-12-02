'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((v) => {
                const option = options.find((opt) => opt.value === v);
                return (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="mr-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(v);
                    }}
                  >
                    {option?.label}
                    <span className="ml-1 text-xs text-red-500">×</span>
                  </Badge>
                );
              })
            ) : (
              <span className="text-gray-400">
                {placeholder || 'اختر العناصر'}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="ابحث..." />
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.label}
                onSelect={() => handleSelect(opt.value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value.includes(opt.value) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
