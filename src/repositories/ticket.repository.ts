import { TicketResponseDTO } from "@/dtos/ticket.dto";
import { PrismaClient, TicketTier, Prisma } from "@/db/prisma";
import { NotFoundError } from "@/utils";

export interface ITicketRepository {
  findAll(): Promise<TicketResponseDTO[]>;
  findByTier(
    tier: TicketTier,
  ): Promise<Pick<TicketResponseDTO, "tier" | "availableQuantity" | "price">>;
  /**
   * Atomically decrements ticket quantity with row-level locking to prevent race conditions.
   * Uses SELECT ... FOR UPDATE to lock the inventory row during the operation.
   * @param tier The ticket tier to decrement
   * @param quantity The number of tickets to decrement
   * @returns Promise<{ count: number }> - count = 1 if successful, 0 if insufficient tickets
   */
  decrementQuantity(tier: TicketTier, quantity: number): Promise<Prisma.BatchPayload>;
}

export class TicketRepository implements ITicketRepository {
  /**
   * Creates a new TicketRepository instance.
   * @param db Prisma client or transaction client for database operations
   */
  constructor(private readonly db: PrismaClient | Prisma.TransactionClient) {}

  /**
   * Retrieves all ticket inventory records.
   * @returns Promise<TicketResponseDTO[]> Array of all ticket inventory data
   */
  async findAll(): Promise<TicketResponseDTO[]> {
    return this.db.ticketInventory.findMany({
      select: {
        id: true,
        tier: true,
        price: true,
        totalQuantity: true,
        availableQuantity: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  /**
   * Finds a specific ticket tier and returns its availability and price.
   * @param tier The ticket tier to search for
   * @returns Promise<Pick<TicketResponseDTO, "tier" | "availableQuantity" | "price">> Ticket data with tier, available quantity, and price
   * @throws NotFoundError if the ticket tier doesn't exist
   */
  async findByTier(tier: TicketTier) {
    const ticket = await this.db.ticketInventory.findUnique({
      where: { tier },
      select: {
        tier: true,
        availableQuantity: true,
        price: true,
      },
    });

    if (!ticket) throw new NotFoundError("Ticket tier not found");

    return ticket;
  }

  async decrementQuantity(tier: TicketTier, quantity: number) {
    // First, lock the row and check availability
    const ticket = await this.db.$queryRaw<{ availableQuantity: number }[]>`
      SELECT "availableQuantity" FROM "TicketInventory" 
      WHERE tier = ${tier} 
      FOR UPDATE
    `;

    if (ticket.length === 0) {
      throw new NotFoundError("Ticket tier not found");
    }

    const currentQuantity = ticket[0].availableQuantity;

    if (currentQuantity < quantity) {
      // Return a payload indicating failure
      return { count: 0 };
    }

    // Now decrement
    const result = await this.db.ticketInventory.updateMany({
      where: { tier },
      data: {
        availableQuantity: {
          decrement: quantity,
        },
      },
    });

    return result;
  }
}
