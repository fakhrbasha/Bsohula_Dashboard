import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface FormFieldProps {
    name:string,
    label: string,
    placeholder?:string,
    type?:string,
    description?: string
}
export const TextField = ({
    name,
    label,
    placeholder,
    type ='text',
    description
}:FormFieldProps) => {
    const {control} = useFormContext();
    return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <input type={type} placeholder={placeholder} {...field} />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage />
            </FormItem>
        )}
        />
    )
}
interface TextareaFieldProps {
    name: string
    label: string
    placeholder?: string
    description?: string
    rows?: number
}

export const TextareaField = ({
    name,
    label,
    placeholder,
    description,
    rows = 4
}: TextareaFieldProps) => {
    const {control} = useFormContext();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <textarea
                            placeholder={placeholder}
                            rows={rows}
                            {...field}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}  
        />
    ) 
}

interface CheckboxFieldProps {
    name: string
    label: string
    description?: string
  }
  
  export function CheckboxField({ name, label, description }: CheckboxFieldProps) {
    const { control } = useFormContext()
  
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
  
  interface SelectFieldProps {
    name: string
    label: string
    options: { value: string; label: string }[]
    placeholder?: string
    description?: string
  }
  
  export function SelectField({ name, label, options, placeholder = "Select an option", description }: SelectFieldProps) {
    const { control } = useFormContext()
  
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

export const NumberField = ({
    name,
    label,
    placeholder,
    description,
    type ='number',
}:FormFieldProps) => {
    const {control} = useFormContext();
    return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <input type={type} placeholder={placeholder} {...field}   />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage />
            </FormItem>
        )}  
        />
    ) 
}