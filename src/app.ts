/**
 * Application Factory
 *
 * Sets up and returns a fully configured Express application instance
 * for the Ticket Booking System backend.
 *
 * Responsibilities:
 * - Security: HTTP headers via Helmet
 * - CORS: configurable cross-origin access
 * - Request parsing: JSON body parser
 * - Logging: HTTP request logging
 * - Rate limiting: protect API from abuse (optional)
 * - Routing: mounts API routes
 * - Health check endpoint
 * - 404 handler for unknown routes
 * - Global error handler for structured error responses
 */

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import ticketsRouter from "@/routes/ticket.routes";
import { httpLogger, NotFoundError } from "@/utils";
import { globalErrorHandler } from "@/middlewares/error-handler";

export const createApp = (): Application => {
  const app = express();

  // ------------------------
  // Security & Performance
  // ------------------------
  app.use(helmet()); // Adds standard security headers
  app.use(compression()); // Enables gzip compression for responses

  // ------------------------
  // CORS Configuration
  // ------------------------
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    }),
  );

  // ------------------------
  // Rate Limiting (optional)
  // ------------------------
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // ------------------------
  // Request Parsing & Logging
  // ------------------------
  app.use(express.json()); // Parse JSON request bodies
  app.use(httpLogger); // Log all HTTP requests

  // ------------------------
  // API Routes
  // ------------------------
  app.use("/api/tickets", ticketsRouter);

  // ------------------------
  // Health Check Endpoint
  // ------------------------
  app.get("/health", async (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // ------------------------
  // 404 Handler
  // ------------------------
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Cannot find ${_req.originalUrl} on this server`));
  });

  // ------------------------
  // Global Error Handler
  // ------------------------
  app.use(globalErrorHandler);

  return app;
};
