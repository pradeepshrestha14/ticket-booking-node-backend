import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TicketTier, Prisma } from "@/generated/prisma";

/**
 * PostgreSQL connection pool for efficient database connections.
 * Uses environment DATABASE_URL for connection configuration.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Prisma adapter for PostgreSQL using the connection pool.
 * Enables Prisma to work with the pg connection pool.
 */
const adapter = new PrismaPg(pool);

/**
 * Singleton Prisma client for the entire application.
 * Configured with PostgreSQL adapter for optimal performance.
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
