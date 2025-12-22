import { z } from "zod";
import { TicketTier } from "@/db/prisma";

/**
 * Zod validation schema for ticket booking requests.
 * Validates the structure and constraints of booking data.
 */
export const bookTicketsSchema = z.object({
  userId: z.string().min(1, "User ID is required"), // Mock user identifier
  tier: z.enum(Object.values(TicketTier)), // replaces deprecated z.nativeEnum
  quantity: z
    .number() // no invalid_type_error here
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than 0" }),
});

/**
 * Type inference from the bookTicketsSchema.
 * Represents the validated structure of ticket booking requests.
 */
export type BookTicketsRequestDto = z.infer<typeof bookTicketsSchema>;
