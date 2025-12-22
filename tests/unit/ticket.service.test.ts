import { createTicketService } from "../../src/services/ticket.service";
import { TicketTier } from "../../src/db/prisma";
import { UnprocessableEntityError, PaymentFailedError } from "../../src/utils/errors";
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
    // Mock payment success
    const mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.5);

    mockRepo.decrementQuantity.mockResolvedValue({ count: 1 });
    mockRepo.findByTier.mockResolvedValue({
      tier: TicketTier.GA,
      availableQuantity: 2,
      price: 50,
    });

    const result = await service.bookTickets({
      userId: "test-user-123",
      tier: TicketTier.GA,
      quantity: 3,
    });

    expect(result.remainingQuantity).toBe(2);
    expect(result.totalAmount).toBe(150); // 50 * 3
    expect(mockRepo.decrementQuantity).toHaveBeenCalledWith("GA", 3);

    mathRandomSpy.mockRestore();
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

  describe("Payment scenarios", () => {
    beforeEach(() => {
      // Mock successful inventory operations
      mockRepo.decrementQuantity.mockResolvedValue({ count: 1 });
      mockRepo.findByTier.mockResolvedValue({
        tier: TicketTier.VIP,
        availableQuantity: 5,
        price: 100,
      });
    });

    it("should successfully book tickets when payment succeeds", async () => {
      // Mock payment success by spying on Math.random to return > 0.1
      const mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = await service.bookTickets({
        userId: "test-user-123",
        tier: TicketTier.VIP,
        quantity: 2,
      });

      expect(result).toEqual({
        tier: TicketTier.VIP,
        bookedQuantity: 2,
        remainingQuantity: 5,
        totalAmount: 200, // 100 * 2
      });
      expect(mockRepo.decrementQuantity).toHaveBeenCalledWith(TicketTier.VIP, 2);

      mathRandomSpy.mockRestore();
    });

    it("should fail booking and rollback when payment fails", async () => {
      // Mock payment failure by spying on Math.random to return <= 0.1
      const mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.05);

      await expect(
        service.bookTickets({
          userId: "test-user-456",
          tier: TicketTier.VIP,
          quantity: 1,
        }),
      ).rejects.toBeInstanceOf(PaymentFailedError);

      // Verify inventory was decremented (but will be rolled back by transaction)
      expect(mockRepo.decrementQuantity).toHaveBeenCalledWith(TicketTier.VIP, 1);

      mathRandomSpy.mockRestore();
    });

    it("should calculate correct total amount for different quantities", async () => {
      const mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = await service.bookTickets({
        userId: "test-user-789",
        tier: TicketTier.VIP,
        quantity: 3,
      });

      expect(result.totalAmount).toBe(300); // 100 * 3
      expect(result.bookedQuantity).toBe(3);

      mathRandomSpy.mockRestore();
    });

    it("should handle payment simulation delay", async () => {
      const mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.5);
      const setTimeoutSpy = jest.spyOn(global, "setTimeout");

      await service.bookTickets({
        userId: "test-user-delay",
        tier: TicketTier.VIP,
        quantity: 1,
      });

      // Verify setTimeout was called with 100ms delay for payment simulation
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);

      mathRandomSpy.mockRestore();
      setTimeoutSpy.mockRestore();
    });
  });
});
