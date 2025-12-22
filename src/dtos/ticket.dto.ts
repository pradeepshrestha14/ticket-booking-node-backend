import { TicketTier } from "@/db/prisma";

/**
 * Data Transfer Object for ticket inventory responses.
 * Contains all public ticket information for API consumers.
 */
export type TicketResponseDTO = {
  /** The ticket tier/category (VIP, FRONT_ROW, GA) */
  tier: TicketTier;
  /** Price per ticket in the tier */
  price: number;
  /** Total number of tickets originally available in this tier */
  totalQuantity: number;
  /** Current number of tickets still available for booking */
  availableQuantity: number;
};
