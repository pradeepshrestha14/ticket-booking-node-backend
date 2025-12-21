import { Router } from "express";
import { Prisma, prisma, PrismaClient } from "../db/prisma";
import { TicketRepository } from "../repositories/ticket.repository";
import { createTicketService } from "../services/ticket.service";
import { getAllTicketsController, bookTicketsController } from "../controllers/ticket.controller";
import { validateRequest } from "../middlewares/validate-request";
import { bookTicketsSchema } from "../validation/book-tickets.schema";

const router = Router();

// Repository factory (supports transactions)
const repoFactory = (tx?: Prisma.TransactionClient | PrismaClient) =>
  new TicketRepository(tx ?? prisma);

// Service
const ticketService = createTicketService(repoFactory);

// Routes
router.get("/", getAllTicketsController(ticketService));
router.post("/book", validateRequest(bookTicketsSchema), bookTicketsController(ticketService));

export default router;
