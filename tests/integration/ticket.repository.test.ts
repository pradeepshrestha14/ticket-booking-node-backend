import { prisma, TicketTier } from "../../src/db/prisma";
import { TicketRepository } from "../../src/repositories/ticket.repository";

describe("TicketRepository (integration)", () => {
  let repo: TicketRepository;

  beforeEach(async () => {
    repo = new TicketRepository(prisma);

    // Reset DB state before each test
    await prisma.ticketInventory.deleteMany();

    await prisma.ticketInventory.createMany({
      data: [
        {
          tier: TicketTier.GA,
          price: 10,
          totalQuantity: 100,
          availableQuantity: 100,
          label: "General Admission",
        },
        {
          tier: TicketTier.VIP,
          price: 100,
          totalQuantity: 10,
          availableQuantity: 10,
          label: "VIP Admission",
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return all tickets", async () => {
    const tickets = await repo.findAll();

    expect(tickets).toHaveLength(2);
    expect(tickets[0]).toHaveProperty("tier");
    expect(tickets[0]).toHaveProperty("availableQuantity");
  });

  it("should find ticket by tier", async () => {
    const ticket = await repo.findByTier(TicketTier.GA);

    expect(ticket.tier).toBe(TicketTier.GA);
    expect(ticket.availableQuantity).toBe(100);
  });

  it("should throw when tier does not exist", async () => {
    await prisma.ticketInventory.deleteMany();

    await expect(repo.findByTier(TicketTier.GA)).rejects.toThrow("Ticket tier not found");
  });

  it("should decrement quantity when enough tickets exist", async () => {
    const result = await repo.decrementQuantity(TicketTier.GA, 5);

    expect(result.count).toBe(1);

    const updated = await repo.findByTier(TicketTier.GA);
    expect(updated.availableQuantity).toBe(95);
  });

  it("should not decrement if quantity exceeds available", async () => {
    const result = await repo.decrementQuantity(TicketTier.GA, 1000);

    expect(result.count).toBe(0);

    const ticket = await repo.findByTier(TicketTier.GA);
    expect(ticket.availableQuantity).toBe(100);
  });

  //  proves correctness
  // Multiple concurrent requests
  // Each tries to book 3 VIP tickets
  // Total available = 10
  // Only 3 requests max can succeed

  // No negative inventory
  it("should prevent double booking under concurrency", async () => {
    const requests = Array.from({ length: 5 }).map(() =>
      prisma.$transaction(async (tx) => {
        const transactionalRepo = new TicketRepository(tx);
        return transactionalRepo.decrementQuantity(TicketTier.VIP, 3);
      }),
    );

    const results = await Promise.all(requests);

    const successful = results.filter((r: { count: number }) => r.count === 1).length;

    expect(successful).toBeLessThanOrEqual(3);

    const final = await repo.findByTier(TicketTier.VIP);
    expect(final.availableQuantity).toBeGreaterThanOrEqual(0);
  });
});
