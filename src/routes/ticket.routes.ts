import { Router } from "express";
import { Prisma, prisma, PrismaClient } from "@/db/prisma";
import { TicketRepository } from "@/repositories/ticket.repository";
import { createTicketService } from "@/services/ticket.service";
import { getAllTicketsController, bookTicketsController } from "@/controllers/ticket.controller";
import { validateRequest } from "@/middlewares/validate-request";
import { bookTicketsSchema } from "@/validation/book-tickets.schema";

const router = Router();

// Repository factory (supports transactions)
const repoFactory = (tx?: Prisma.TransactionClient | PrismaClient) =>
  new TicketRepository(tx ?? prisma);

// Service
const ticketService = createTicketService(repoFactory);

// Routes
/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all available tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: List of available tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tier:
 *                     type: string
 *                     enum: [VIP, FRONT_ROW, GA]
 *                   price:
 *                     type: number
 *                   availableQuantity:
 *                     type: integer
 *                   totalQuantity:
 *                     type: integer
 */
router.get("/", getAllTicketsController(ticketService));

/**
 * @swagger
 * /api/tickets/book:
 *   post:
 *     summary: Book tickets
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - tier
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Unique user identifier
 *               tier:
 *                 type: string
 *                 enum: [VIP, FRONT_ROW, GA]
 *                 description: Ticket tier to book
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Number of tickets to book
 *     responses:
 *       200:
 *         description: Booking successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookingId:
 *                   type: string
 *                 remainingQuantity:
 *                   type: integer
 *       400:
 *         description: Bad request - invalid input or insufficient tickets
 *       500:
 *         description: Internal server error
 */
router.post("/book", validateRequest(bookTicketsSchema), bookTicketsController(ticketService));

export default router;
