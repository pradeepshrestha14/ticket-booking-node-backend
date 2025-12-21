import { TicketRepository } from "../repositories/ticket.repository";
import { prisma, PrismaClient, Prisma } from "../db/prisma";
import { BookTicketsRequestDto, BookTicketsResponseDTO } from "../dtos/book-ticket.dto";
import { TicketResponseDTO } from "../dtos/ticket.dto";
import { NotFoundError, UnprocessableEntityError } from "../utils/errors";

/**
 * Factory function to create service with DI
 */
export const createTicketService = (
  repoFactory: (tx?: Prisma.TransactionClient | PrismaClient) => TicketRepository,
) => {
  const getAllTickets = async (): Promise<TicketResponseDTO[]> => {
    const repo = repoFactory();
    return repo.findAll();
  };

  const bookTickets = async (payload: BookTicketsRequestDto): Promise<BookTicketsResponseDTO> => {
    const { tier, quantity } = payload;

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
