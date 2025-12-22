import { Request, Response, NextFunction } from "express";
import { createTicketService } from "@/services/ticket.service";
import { BookTicketsRequestDto, BookTicketsResponseDTO } from "@/dtos/book-ticket.dto";
import { TicketResponseDTO } from "@/dtos/ticket.dto";

export type TicketService = ReturnType<typeof createTicketService>;

/**
 * Controller for retrieving all available tickets.
 * Returns ticket inventory with current availability and pricing.
 * @param ticketService Injected ticket service instance
 * @returns Express middleware function
 */
export const getAllTicketsController =
  (ticketService: TicketService) => async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets: TicketResponseDTO[] = await ticketService.getAllTickets();
      res.json({ success: true, data: tickets });
    } catch (err) {
      next(err);
    }
  };

/**
 * Controller for booking tickets with validation and concurrency control.
 * Handles ticket booking requests with atomic operations to prevent double-booking.
 * @param ticketService Injected ticket service instance
 * @returns Express middleware function
 */
export const bookTicketsController =
  (ticketService: TicketService) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: BookTicketsRequestDto = req.body;
      const result: BookTicketsResponseDTO = await ticketService.bookTickets(payload);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
