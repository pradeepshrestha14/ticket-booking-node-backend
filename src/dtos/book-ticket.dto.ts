import { BookTicketsRequestDto } from "@/validation/book-tickets.schema";
import { TicketTier } from "@/db/prisma";

/**
 * Data Transfer Object for ticket booking responses.
 * Contains confirmation details after successful booking.
 */
interface BookTicketsResponseDTO {
  /** The ticket tier that was booked */
  tier: TicketTier;
  /** Number of tickets successfully booked */
  bookedQuantity: number;
  /** Number of tickets remaining in this tier after booking */
  remainingQuantity: number;
  /** Total amount paid for the booking */
  totalAmount: number;
}

export { BookTicketsRequestDto, BookTicketsResponseDTO };
