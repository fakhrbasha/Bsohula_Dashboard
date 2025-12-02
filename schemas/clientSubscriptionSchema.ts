import { z } from "zod";

export const clientSubscriptionSchema = z.object({
    clientId: z.string(),
    subscriptionId: z.string(),
    paidAmount: z.number(),
    products: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number(),
        })
    ),
});

export type ClientSubscriptionFileds = z.infer<typeof clientSubscriptionSchema>;