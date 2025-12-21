import { Request, Response, NextFunction } from "express";
import { createTicketService } from "@/services/ticket.service";
import { BookTicketsRequestDto, BookTicketsResponseDTO } from "@/dtos/book-ticket.dto";
import { TicketResponseDTO } from "@/dtos/ticket.dto";

export type TicketService = ReturnType<typeof createTicketService>;

export const getAllTicketsController =
  (ticketService: TicketService) => async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets: TicketResponseDTO[] = await ticketService.getAllTickets();
      res.json({ success: true, data: tickets });
    } catch (err) {
      next(err);
    }
  };

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
