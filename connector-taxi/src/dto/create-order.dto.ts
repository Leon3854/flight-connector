import { z } from "zod";

export const CreateOrderSchema = z.object({
  source: z.object({
    lat: z.number(),
    lon: z.number(),
    address: z.string().optional(),
  }),
  destination: z.object({
    lat: z.number(),
    lon: z.number(),
    address: z.string().optional(),
  }),
  requirements: z
    .object({
      childChair: z.boolean().optional(),
      smoking: z.boolean().optional(),
      animalFriendly: z.boolean().optional(),
    })
    .optional(),
  tariffClass: z.string().optional(),
  paymentMethod: z.string().optional(),
  comment: z.string().optional(),
  call: z.boolean().optional(),
  maxWaitMinutes: z.number().optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
