import { BookTicketsRequestDto } from "@/validation/book-tickets.schema";
import { TicketTier } from "@/db/prisma";

interface BookTicketsResponseDTO {
  tier: TicketTier;
  bookedQuantity: number;
  remainingQuantity: number;
}

export { BookTicketsRequestDto, BookTicketsResponseDTO };
