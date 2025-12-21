import { z } from "zod";
import { TicketTier } from "../db/prisma";

export const bookTicketsSchema = z.object({
  tier: z.enum(Object.values(TicketTier)), // replaces deprecated z.nativeEnum
  quantity: z
    .number() // no invalid_type_error here
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than 0" }),
});

export type BookTicketsRequestDto = z.infer<typeof bookTicketsSchema>;
