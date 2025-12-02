import z from 'zod'
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    userType: z.string().default('admin'),
})
export type loginSchemaFields = z.infer<typeof loginSchema>