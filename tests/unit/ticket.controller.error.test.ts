import {
  getAllTicketsController,
  bookTicketsController,
  TicketService,
} from "../../src/controllers/ticket.controller";

import { UnprocessableEntityError } from "../../src/utils/errors";
import { Request, Response, NextFunction } from "express";

// Controller responsibility testing correctly
// No HTTP stack
// No DB
// No Express internals
describe("TicketController - error handling (unit)", () => {
  const mockService = {
    getAllTickets: jest.fn(),
    bookTickets: jest.fn(),
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next(err) when getAllTickets throws", async () => {
    const error = new Error("DB failed");
    mockService.getAllTickets.mockRejectedValue(error);

    const controller = getAllTicketsController(mockService as TicketService);

    await controller({} as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should call next(err) when booking fails", async () => {
    const error = new UnprocessableEntityError("INSUFFICIENT_TICKETS");

    mockService.bookTickets.mockRejectedValue(error);

    const controller = bookTicketsController(mockService as TicketService);

    await controller({ body: { tier: "GA", quantity: 100 } } as Request, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
