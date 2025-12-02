"use client"

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useController } from "react-hook-form"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

interface TipTapFormElementProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: {
    control: Control<TFieldValues>
  }
  name: TName
  label?: string
  placeholder?: string
  className?: string
  minHeight?: string
}

export default function TipTapFormElementSimplr<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  label,
  placeholder,
  className,
  minHeight = "200px",
}: TipTapFormElementProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  })

  return (
    <FormItem className={className}>
      {label && <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>}
      <FormControl>
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <SimpleEditor
            content={field.value || ""}
            onUpdate={({ editor }) => {
              const html = editor.getHTML()
              const isEmpty = html === "<p></p>" || html === ""
              field.onChange(isEmpty ? "" : html)
            }}
            editorProps={{
              attributes: {
                class: cn(
                  "prose prose-sm p-4 text-right",
                  `min-h-[${minHeight}]`,
                  "focus:outline-none",
                  "prose-headings:text-gray-900 prose-p:text-gray-700",
                ),
                placeholder: placeholder,
              },
            }}
            placeholder={placeholder}
            showToolbar={true}
          />
        </Card>
      </FormControl>
      {error && <FormMessage className="text-red-600 text-sm mt-1">{error.message}</FormMessage>}
    </FormItem>
  )
}
