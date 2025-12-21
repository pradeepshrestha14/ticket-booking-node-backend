import { createTicketService } from "../../src/services/ticket.service";
import { TicketTier } from "../../src/db/prisma";
import { UnprocessableEntityError } from "../../src/utils/errors";
import { TicketRepository } from "../../src/repositories/ticket.repository";

describe("TicketService - unit", () => {
  const mockRepo = {
    findAll: jest.fn(),
    findByTier: jest.fn(),
    decrementQuantity: jest.fn(),
  };

  const repoFactory = () => mockRepo as unknown as TicketRepository;

  const service = createTicketService(repoFactory);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Test 'getAllTickets': should return all tickets", async () => {
    mockRepo.findAll.mockResolvedValue([
      { tier: "GA", price: 50, totalQuantity: 100, availableQuantity: 5 },
      { tier: "VIP", price: 100, totalQuantity: 10, availableQuantity: 7 },
    ]);

    const result = await service.getAllTickets();

    expect(result).toHaveLength(2);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it("Test 'bookTickets': should book tickets successfully", async () => {
    mockRepo.decrementQuantity.mockResolvedValue({ count: 1 });
    mockRepo.findByTier.mockResolvedValue({
      tier: TicketTier.GA,
      availableQuantity: 2,
    });

    const result = await service.bookTickets({
      userId: "test-user-123",
      tier: TicketTier.GA,
      quantity: 3,
    });

    expect(result.remainingQuantity).toBe(2);
    expect(mockRepo.decrementQuantity).toHaveBeenCalledWith("GA", 3);
  });

  it("should throw error if insufficient tickets", async () => {
    mockRepo.decrementQuantity.mockResolvedValue({ count: 0 });

    await expect(
      service.bookTickets({
        userId: "test-user-123",
        tier: TicketTier.GA,
        quantity: 100,
      }),
    ).rejects.toBeInstanceOf(UnprocessableEntityError);
  });
});
