// “At unit level,
// => assert that controllers forward errors to next() instead of handling them.

// At integration level,
//  => test that the global error middleware converts domain errors into proper HTTP responses.”

import request from "supertest";
import express from "express";
import {
  bookTicketsController,
  TicketService,
} from "../../src/controllers/ticket.controller";
import { globalErrorHandler } from "../../src/middlewares/error-handler";
import { UnprocessableEntityError } from "../../src/utils/errors";

describe("TicketController - error response", () => {
  const app = express();
  app.use(express.json());

  const mockService = {
    bookTickets: jest.fn(),
    // getAllTickets: () => Promise<TicketResponseDTO[]>;
    getAllTickets: jest.fn(),
  };

  app.post(
    "/tickets/book",
    bookTicketsController(mockService as TicketService),
  );

  app.use(globalErrorHandler);

  it("should return 422 when service throws UnprocessableEntityError", async () => {
    mockService.bookTickets.mockRejectedValue(
      new UnprocessableEntityError("INSUFFICIENT_TICKETS"),
    );

    const res = await request(app)
      .post("/tickets/book")
      .send({ tier: "GA", quantity: 999 });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNPROCESSABLE_ENTITY");
    expect(res.body.error.message).toBe("INSUFFICIENT_TICKETS");
  });
});
