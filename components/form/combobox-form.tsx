"use client"

import type React from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import type { UseFormReturn, Path, FieldValues, PathValue } from "react-hook-form"
import { CustomCombobox } from "../combobox"

export interface ComboboxOption {
  value: string
  label: string
  [key: string]: any
}

export interface FormComboboxProps<T extends FieldValues> {
  // Form integration props
  form: UseFormReturn<T>
  name: Path<T>

  // UI and labeling
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string

  // Data and filtering
  options: ComboboxOption[]
  searchField?: string
  filterFunction?: (option: ComboboxOption, searchValue: string) => boolean

  // Styling
  className?: string
  labelClassName?: string
  comboboxClassName?: string
  contentClassName?: string

  // Behavior and customization
  disabled?: boolean
  clearable?: boolean
  width?: number | string
  maxHeight?: number
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode

  // Callbacks
  onOpenChange?: (open: boolean) => void
}

export function ComboboxFormEle<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  labelClassName,
  disabled,
  clearable = true,
}: FormComboboxProps<T>) {

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn("space-y-2", className)}>
            {label && <FormLabel className={cn("text-sm font-medium", labelClassName)}>{label}</FormLabel>}
            <FormControl>
              <CustomCombobox
                options={options}
                placeholder={placeholder}
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
                clearable={clearable}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
