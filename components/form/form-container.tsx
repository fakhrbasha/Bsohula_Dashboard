'use client'
import React from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import type {z} from 'zod' 
import { Button } from '../ui/button'
import { Form } from '../ui/form'
export interface FormContainerprops <T extends z.ZodType>{
    schema : T,
    defaultValues: Partial<z.infer<T>>
    onSubmit : SubmitHandler<z.infer<T>>,
    children : React.ReactNode,
    className?: string,
    submitLabel?: string
}

export const FormContainer = <T extends z.ZodType>({
    schema,
    defaultValues,
    onSubmit,
    children,
    className ="",
    submitLabel = "Submit"
}:FormContainerprops<T>) => {
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as z.infer<T>,
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
                
            </form>
        </Form>
    )
}


