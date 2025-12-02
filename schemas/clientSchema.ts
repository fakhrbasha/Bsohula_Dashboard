import z from 'zod'
export const ClientSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    nationality: z.string().max(20),
    phone: z.string().min(9),
    address: z.string().min(3).max(20),
})

export type ClientSchemaFields = z.infer<typeof ClientSchema>