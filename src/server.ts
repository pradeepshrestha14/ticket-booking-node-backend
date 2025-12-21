import dotenv from "dotenv";
import { createApp } from "./app";
import { logger } from "./utils";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = createApp();

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// handle unhandled rejections / exceptions globally
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${(err as Error).message}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${(err as Error).message}`);
});
