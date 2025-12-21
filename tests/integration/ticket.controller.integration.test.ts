// Controller integration tests only verify correct HTTP behavior and middleware wiring.”
// verify concurrency at the repository level and via stress tests.

import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/db/prisma";
import { TicketTier } from "../../src/generated/prisma";

const app = createApp();

beforeEach(async () => {
  await prisma.ticketInventory.deleteMany();

  await prisma.ticketInventory.create({
    data: {
      tier: TicketTier.GA,
      price: 10,
      totalQuantity: 10,
      availableQuantity: 10,
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

it("POST /api/tickets/book → 201 success", async () => {
  const res = await request(app)
    .post("/api/tickets/book")
    .send({ tier: "GA", quantity: 3 });

  expect(res.status).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.data).toEqual({
    tier: "GA",
    bookedQuantity: 3,
    remainingQuantity: 7,
  });
});

it("POST /api/tickets/book → 422 insufficient tickets", async () => {
  const res = await request(app)
    .post("/api/tickets/book")
    .send({ tier: "GA", quantity: 100 });

  expect(res.status).toBe(422);
  expect(res.body.error.message).toBe("INSUFFICIENT_TICKETS");
  expect(res.body.error.code).toBe("UNPROCESSABLE_ENTITY");
});

it("POST /api/tickets/book → 400 validation error", async () => {
  const res = await request(app).post("/api/tickets/book").send({ tier: "GA" });

  expect(res.status).toBe(400);
  expect(res.body.error.message).toBe("Validation failed");
});

it("POST /api/tickets/book → 400 invalid tier field", async () => {
  const res = await request(app)
    .post("/api/tickets/book")
    .send({ tier: "INVALID", quantity: 1 });

  expect(res.status).toBe(400);
});
