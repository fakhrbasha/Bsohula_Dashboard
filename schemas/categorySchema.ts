import { z } from "zod";

export const categorySchema = z.object({
    name: z.object({
        ar: z.string().min(1, "الاسم بالعربية مطلوب"),
        en: z.string().min(1, "Name in English is required"),
    }),
    description: z.object({
        ar: z.string().min(1, "الوصف بالعربية مطلوب"),
        en: z.string().min(1, "Description in English is required"),
    }),
});

export type categorySchemaFields = z.infer<typeof categorySchema>;