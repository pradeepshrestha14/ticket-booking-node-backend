import dotenv from "dotenv";
import { createApp } from "@/app";
import { logger } from "@/utils";
import { prisma } from "@/db/prisma";

dotenv.config();

/**
 * Server port configuration.
 * Uses PORT environment variable or defaults to 4000.
 */
const PORT = process.env.PORT || 4000;

/**
 * Create and configure the Express application instance.
 */
const app = createApp();

/**
 * Start the server and store the server instance for graceful shutdown.
 */
const server = app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

/**
 * Graceful shutdown function to properly close connections and cleanup resources.
 */
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      // Disconnect from database
      await prisma.$disconnect();
      logger.info("Database connection closed");

      // Exit the process
      process.exit(0);
    } catch (error) {
      logger.error(`Error during shutdown: ${(error as Error).message}`);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

/**
 * Handle SIGTERM signal (sent by process managers like PM2, Docker, etc.)
 */
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

/**
 * Handle SIGINT signal (Ctrl+C in terminal)
 */
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// handle unhandled rejections / exceptions globally
/**
 * Global handler for unhandled promise rejections.
 * Logs the error and initiates graceful shutdown.
 */
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${(err as Error).message}`);
  gracefulShutdown("unhandledRejection");
});

/**
 * Global handler for uncaught exceptions.
 * Logs the error and initiates graceful shutdown.
 */
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${(err as Error).message}`);
  gracefulShutdown("uncaughtException");
});
