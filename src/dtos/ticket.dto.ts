import { TicketTier } from "../db/prisma";

export type TicketResponseDTO = {
  tier: TicketTier;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
};
