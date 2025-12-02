import { z } from "zod";

export const subscriptionsSchema = z.object({
    name: z.string().min(1, { message: "الاسم مطلوب" }),
    description: z.string().min(1, { message: "الوصف مطلوب" }),
    price: z.number().min(1, { message: "سعر الاشتراك مطلوب" }),
    productLimit: z.number().min(1, { message: "عدد المنتجات المسموح بها مطلوب" }),
    voucherLimit: z.number().min(1, { message: "عدد القسائم المسموح بها مطلوب" }),
    duration: z.number().min(1, { message: "المده (بالشهور) مطلوبة" }),
    categoryIds: z.array(z.string()).optional(),
})
export type SubscriptionsSchemaFields = z.infer<typeof subscriptionsSchema>;