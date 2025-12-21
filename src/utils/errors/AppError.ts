/**
 * AppError
 *
 * Base application error class used to represent known, operational errors
 * throughout the Ticket Booking System backend.
 *
 * This class extends the native `Error` object and enriches it with:
 * - HTTP status codes for consistent API responses
 * - Application-specific error codes for client-side handling
 * - Optional contextual details (e.g. validation metadata)
 * - An `isOperational` flag to distinguish expected errors from programmer bugs
 *
 * AppError instances are thrown for predictable failure scenarios such as:
 * - Validation errors
 * - Resource not found errors
 * - Authorization and business rule violations
 *
 * File: src/utils/errors/AppError.ts
 */

import { ERROR_CODES, ErrorCode, ErrorName, HTTP_STATUS, HttpStatusCode } from "../../constants";

export class AppError extends Error {
  public readonly status: HttpStatusCode;
  public readonly code: ErrorCode;
  public readonly details: unknown | null;
  public readonly isOperational: boolean;

  constructor(
    name: ErrorName,
    message: string,
    status: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ErrorCode = ERROR_CODES.INTERNAL_ERROR,
    details: unknown | null = null,
    isOperational = true,
  ) {
    super(message);

    this.name = name;
    this.status = status;
    this.code = code;
    this.details = details; // For additional error/validation context
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
