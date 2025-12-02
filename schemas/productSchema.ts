import { z } from "zod"

export const productSchema = z.object({
    name: z.object({
        ar: z.string().min(1),
        en: z.string().min(1),
    }),
    description: z.object({
        ar: z.string().min(1),
        en: z.string().min(1),
    }),
    category: z.string().min(1),
    image:z.any(),
    
})

export type productSchemaFields = z.infer<typeof productSchema>