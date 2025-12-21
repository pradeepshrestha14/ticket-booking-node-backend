import { pinoHttp } from "pino-http";
import pino from "pino";

/*
 * Logger Configuration
 * This module sets up and exports a Pino logger and an HTTP logger middleware for Express.
 * The logger is configured with a service name, serializers, and a pretty-print transport for errors.
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

const httpLogger = pinoHttp({
  level: process.env.LOG_LEVEL,
  logger,
});

export { logger, httpLogger };
