import dotenv from "dotenv";
import { createApp } from "@/app";
import { logger } from "@/utils";

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

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// handle unhandled rejections / exceptions globally
/**
 * Global handler for unhandled promise rejections.
 * Logs the error and prevents the application from crashing unexpectedly.
 */
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${(err as Error).message}`);
});

/**
 * Global handler for uncaught exceptions.
 * Logs the error and prevents the application from crashing unexpectedly.
 */
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${(err as Error).message}`);
});
