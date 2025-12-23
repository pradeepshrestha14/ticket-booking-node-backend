import { TicketRepository } from "@/repositories/ticket.repository";
import { prisma, PrismaClient, Prisma } from "@/db/prisma";
import { BookTicketsRequestDto, BookTicketsResponseDTO } from "@/dtos/book-ticket.dto";
import { TicketResponseDTO } from "@/dtos/ticket.dto";
import { NotFoundError, UnprocessableEntityError, PaymentFailedError } from "@/utils/errors";

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
   * Simulates payment processing with random success/failure.
   * In a real system, this would integrate with payment providers like Stripe.
   * @param amount Total amount to charge
   * @returns Promise<boolean> True if payment succeeds, false if fails
   */
  const simulatePayment = async (amount: number): Promise<boolean> => {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simulate 90% success rate, 10% failure rate
    const success = Math.random() > 0.1;

    if (!success) {
      console.log(`Payment failed for amount: $${amount}`);
    } else {
      console.log(`Payment succeeded for amount: $${amount}`);
    }

    return success;
  };

  /**
   * Books tickets with concurrency control and transactional integrity.
   * Uses database transactions and row-level locking to prevent double-booking.
   * @param payload Booking request containing userId, tier, and quantity
   * @returns Promise<BookTicketsResponseDTO> Booking confirmation with remaining quantity
   * @throws UnprocessableEntityError if insufficient tickets available
   * @throws PaymentFailedError if payment processing fails
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

      // Calculate total amount
      const totalAmount = ticket.price * quantity;

      // Decrement inventory first
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

      // Simulate payment processing
      const paymentSuccess = await simulatePayment(totalAmount);
      if (!paymentSuccess) {
        throw new PaymentFailedError("Payment processing failed. Please try again.", [
          {
            path: "payment",
            message: "Payment processing failed. Please try again.",
          },
        ]);
      }

      // Create booking record only if payment succeeds
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
        totalAmount,
      };
    });
  };

  return { getAllTickets, bookTickets };
};
