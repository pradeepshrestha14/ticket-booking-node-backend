import request from "supertest";
import express from "express";
import {
  getAllTicketsController,
  bookTicketsController,
  TicketService,
} from "../../src/controllers/ticket.controller";

describe("TicketController", () => {
  const app = express();
  app.use(express.json());

  const mockService = {
    getAllTickets: jest.fn(),
    bookTickets: jest.fn(),
  };

  app.get("/tickets", getAllTicketsController(mockService as TicketService));
  app.post(
    "/tickets/book",
    bookTicketsController(mockService as TicketService),
  );

  it("GET /tickets", async () => {
    mockService.getAllTickets.mockResolvedValue([]);

    const res = await request(app).get("/tickets");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /tickets/book", async () => {
    mockService.bookTickets.mockResolvedValue({
      tier: "GA",
      bookedQuantity: 2,
      remainingQuantity: 8,
    });

    const res = await request(app)
      .post("/tickets/book")
      .send({ tier: "GA", quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.data.bookedQuantity).toBe(2);
  });
});

// ============

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

    await controller(
      { body: { tier: "GA", quantity: 100 } } as Request,
      res,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
