"use client"

import { FormContainer } from "./form-container"
import { TextField, TextareaField, CheckboxField, SelectField } from "./form-fields"
import type { z } from "zod"

type FieldType = "text" | "textarea" | "checkbox" | "select" | "email" | "password"

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  description?: string
  options?: { value: string; label: string }[]
  rows?: number
}

interface FormFactoryProps<T extends z.ZodType> {
  schema: T
  defaultValues: Partial<z.infer<T>>
  onSubmit: (data: z.infer<T>) => Promise<void>
  fields: FieldConfig[]
  title?: string
  description?: string
  submitLabel?: string
  className?: string
}

export function FormFactory<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  title,
  description,
  submitLabel = "Submit",
  className = "",
}: FormFactoryProps<T>) {
  return (
    <div className={className}>
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground mb-6">{description}</p>}

      <FormContainer schema={schema} defaultValues={defaultValues} onSubmit={onSubmit} submitLabel={submitLabel}>
        {fields.map((field) => {
          switch (field.type) {
            case "text":
            case "email":
            case "password":
              return (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  description={field.description}
                />
              )
            case "textarea":
              return (
                <TextareaField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  description={field.description}
                  rows={field.rows}
                />
              )
            case "checkbox":
              return (
                <CheckboxField key={field.name} name={field.name} label={field.label} description={field.description} />
              )
            case "select":
              return (
                <SelectField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  description={field.description}
                />
              )
            default:
              return null
          }
        })}
      </FormContainer>
    </div>
  )
}
