"use client";

import type React from "react";
import type { UseFormReturn, Path, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const globalConfig = {
  styles: {
    mainClassName: "space-y-2.5 w-full",
    inputClassName: "w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20",
    labelClassName: "text-sm font-medium text-gray-700 dark:text-gray-200",
    errorClassName: "text-sm text-red-500 dark:text-red-400",
    disabledClassName: "opacity-50 cursor-not-allowed",
    requiredClassName: "text-red-500 ml-1",
  },
};

interface CustomInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

export default function TextFormEle<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  className,
  labelClassName,
  inputClassName,
  type = "text",
}: CustomInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(globalConfig.styles.mainClassName, className)}>
          {label && (
            <FormLabel
              className={cn(globalConfig.styles.labelClassName, labelClassName)}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              className={cn(globalConfig.styles.inputClassName, inputClassName)}
              value={field.value}
              onChange={(e) => {
                let value: string | number | Date = e.target.value;
                if (type === "number") {
                  value = value === "" ? "" : Number(value);
                } else if (type === "date") {
                  value = new Date(value);
                }
                field.onChange(value);
                form.trigger(name);
              }}
            />
          </FormControl>
          <FormMessage className={globalConfig.styles.errorClassName} />
        </FormItem>
      )}
    />
  );
}
