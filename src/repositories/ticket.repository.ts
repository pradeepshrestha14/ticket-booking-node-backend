import { TicketResponseDTO } from "@/dtos/ticket.dto";
import { PrismaClient, TicketTier, Prisma } from "@/generated/prisma";
import { NotFoundError } from "@/utils";

export interface ITicketRepository {
  findAll(): Promise<TicketResponseDTO[]>;
  findByTier(tier: TicketTier): Promise<Pick<TicketResponseDTO, "tier" | "availableQuantity">>;
  decrementQuantity(tier: TicketTier, quantity: number): Promise<Prisma.BatchPayload>;
}

export class TicketRepository implements ITicketRepository {
  constructor(private readonly db: PrismaClient | Prisma.TransactionClient) {}
  async findAll(): Promise<TicketResponseDTO[]> {
    return this.db.ticketInventory.findMany({
      select: {
        tier: true,
        price: true,
        totalQuantity: true,
        availableQuantity: true,
      },
    });
  }

  async findByTier(tier: TicketTier) {
    const ticket = await this.db.ticketInventory.findUnique({
      where: { tier },
      select: {
        tier: true,
        availableQuantity: true,
      },
    });

    if (!ticket) throw new NotFoundError("Ticket tier not found");

    return ticket;
  }

  async decrementQuantity(tier: TicketTier, quantity: number) {
    return this.db.ticketInventory.updateMany({
      where: {
        tier,
        availableQuantity: {
          gte: quantity, // critical concurrency guard
        },
      },
      data: {
        availableQuantity: {
          decrement: quantity,
        },
      },
    });
  }
}
