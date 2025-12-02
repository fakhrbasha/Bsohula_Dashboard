"use client";
import type { UseFormReturn, Path, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const globalConfig = {
  styles: {
    mainClassName: "space-y-2",
    labelClassName: "!text-[16px]",
    buttonGroup: "flex space-x-2",
    button: {
      base: "flex-1",
      active: "bg-main-red hover:bg-main-red/90 text-white",
      inactive: "bg-main-gray/80 text-black/90 hover:bg-main-gray/90",
    },
  },
};

interface YesNoFormEleProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
}

export default function YesNoFormEle<T extends FieldValues>({
  form,
  name,
  label,
  description,
  className,
  labelClassName,
}: YesNoFormEleProps<T>) {

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
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <div className={globalConfig.styles.buttonGroup}>
              <Button
                type="button"
                className={cn(
                  globalConfig.styles.button.base,
                  field.value === true
                    ? globalConfig.styles.button.active
                    : globalConfig.styles.button.inactive
                )}
                onClick={() => {
                  field.onChange(true);
                  form.trigger(name);
                }}
              >
                {("yes")}
              </Button>
              <Button
                type="button"
                className={cn(
                  globalConfig.styles.button.base,
                  field.value === false
                    ? globalConfig.styles.button.active
                    : globalConfig.styles.button.inactive
                )}
                onClick={() => {
                  field.onChange(false);
                  form.trigger(name);
                }}
              >
                {("no")}
              </Button>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
