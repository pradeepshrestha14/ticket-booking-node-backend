import { pinoHttp } from "pino-http";
import pino from "pino";

/*
 * Logger Configuration
 * This module sets up and exports a Pino logger and an HTTP logger middleware for Express.
 * The logger is configured with a service name, serializers, and a pretty-print transport for errors.
 */

/**
 * Main application logger using Pino.
 * Configured with service name, timestamp formatting, and pretty-printing for development.
 */
const logger = pino({
  level: "info",
  base: {
    serviceName: "Ticket-Booking-Service",
  },
  serializers: pino.stdSerializers,
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  transport: {
    target: "pino-pretty", // for production we can use sentry
    level: "error",
  },
});

/**
 * HTTP request logger middleware for Express.
 * Logs all incoming HTTP requests with configurable log level.
 */
const httpLogger = pinoHttp({
  level: process.env.LOG_LEVEL,
  logger,
});

export { logger, httpLogger };
