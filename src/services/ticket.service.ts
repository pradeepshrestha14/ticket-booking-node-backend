import { TicketRepository } from "@/repositories/ticket.repository";
import { prisma, PrismaClient, Prisma } from "@/db/prisma";
import { BookTicketsRequestDto, BookTicketsResponseDTO } from "@/dtos/book-ticket.dto";
import { TicketResponseDTO } from "@/dtos/ticket.dto";
import { NotFoundError, UnprocessableEntityError } from "@/utils/errors";

/**
 * Factory function to create ticket service with dependency injection.
 * Provides business logic for ticket operations with transactional support.
 * @param repoFactory Function that creates TicketRepository instances (supports transactions)
 * @returns Object containing ticket service methods
 */
export const createTicketService = (
  repoFactory: (tx?: Prisma.TransactionClient | PrismaClient) => TicketRepository,
) => {
  /**
   * Retrieves all available tickets from inventory.
   * @returns Promise<TicketResponseDTO[]> Array of ticket inventory data
   */
  const getAllTickets = async (): Promise<TicketResponseDTO[]> => {
    const repo = repoFactory();
    return repo.findAll();
  };

  /**
   * Books tickets with concurrency control and transactional integrity.
   * Uses database transactions and row-level locking to prevent double-booking.
   * @param payload Booking request containing userId, tier, and quantity
   * @returns Promise<BookTicketsResponseDTO> Booking confirmation with remaining quantity
   * @throws UnprocessableEntityError if insufficient tickets available
   * @throws NotFoundError if ticket tier doesn't exist
   */
  const bookTickets = async (payload: BookTicketsRequestDto): Promise<BookTicketsResponseDTO> => {
    const { userId, tier, quantity } = payload;

    return prisma.$transaction(async (tx) => {
      const repo = repoFactory(tx); // transactional repo
      const ticket = await repo.findByTier(tier);
      if (!ticket) {
        throw new NotFoundError("TICKET_NOT_FOUND");
      }
      const data = await repo.decrementQuantity(tier, quantity);
      if (data.count === 0) {
        const err = new UnprocessableEntityError("INSUFFICIENT_TICKETS", [
          {
            path: "quantity",
            message: "Requested quantity exceeds available tickets",
          },
        ]);
        throw err;
      }

      // Create booking record with user ID
      await tx.booking.create({
        data: {
          userId,
          tier,
          quantity,
          status: "confirmed",
        },
      });

      const updatedTicket = await repo.findByTier(tier);

      return {
        tier,
        bookedQuantity: quantity,
        remainingQuantity: updatedTicket.availableQuantity,
      };
    });
  };

  return { getAllTickets, bookTickets };
};
