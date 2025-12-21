import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TicketTier, Prisma } from "../generated/prisma";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

/**
 * Singleton Prisma client for the entire application.
 */
const prisma = new PrismaClient({
  adapter,
});

export {
  prisma,

  // Explicitly re-export Prisma artifacts
  Prisma,
  PrismaClient,
  TicketTier,
};
