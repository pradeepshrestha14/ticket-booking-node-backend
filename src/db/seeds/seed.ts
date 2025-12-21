/**
 * Prisma seed file for initializing ticket inventory.
 *
 * This script populates the `ticketInventory` table with default ticket tiers,
 * pricing, and stock quantities.
 *
 * Ticket Tiers:
 * - VIP        → $100,  50 tickets
 * - FRONT_ROW  → $50,   200 tickets
 * - GA         → $10,   1000 tickets
 *
 * Usage:
 *   npx prisma db seed
 */

import { prisma } from "../prisma";
import { TicketTier } from "../prisma";

async function main() {
  await prisma.ticketInventory.upsert({
    where: { tier: TicketTier.VIP },
    update: {},
    create: {
      tier: TicketTier.VIP,
      price: 100,
      totalQuantity: 50,
      availableQuantity: 50,
    },
  });

  await prisma.ticketInventory.upsert({
    where: { tier: TicketTier.FRONT_ROW },
    update: {},
    create: {
      tier: TicketTier.FRONT_ROW,
      price: 50,
      totalQuantity: 200,
      availableQuantity: 200,
    },
  });

  await prisma.ticketInventory.upsert({
    where: { tier: TicketTier.GA },
    update: {},
    create: {
      tier: TicketTier.GA,
      price: 10,
      totalQuantity: 1000,
      availableQuantity: 1000,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
