import { AppError } from "./AppError";
import { HTTP_STATUS, ERROR_CODES, ERROR_NAMES } from "@/constants";

/*
 * Specific HTTP Error Classes
 * These classes extend the base AppError to represent common HTTP error scenarios.
 * Each class sets appropriate default values for name, status, code, and message.
 */

/**
 * Error class for HTTP 400 Bad Request errors.
 * Used when the request contains invalid data or parameters.
 */
export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details: unknown | null = null) {
    super(
      ERROR_NAMES.BAD_REQUEST,
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      details,
    );
  }
}

/**
 * Error class for HTTP 401 Unauthorized errors.
 * Used when authentication is required but not provided.
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(ERROR_NAMES.UNAUTHORIZED, message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

/**
 * Error class for HTTP 403 Forbidden errors.
 * Used when the authenticated user lacks permission for the requested resource.
 */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(ERROR_NAMES.FORBIDDEN, message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

/**
 * Error class for HTTP 404 Not Found errors.
 * Used when the requested resource does not exist.
 */
export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(ERROR_NAMES.NOT_FOUND, message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

/**
 * Error class for HTTP 409 Conflict errors.
 * Used when the request conflicts with the current state of the resource.
 */
export class ConflictError extends AppError {
  constructor(message = "Conflict", details: string | null = null) {
    super(ERROR_NAMES.CONFLICT, message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, details);
  }
}

/**
 * Error class for HTTP 422 Unprocessable Entity errors.
 * Used for validation errors and business rule violations.
 */
export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable Entity", details: unknown | null = null) {
    super(
      ERROR_NAMES.UNPROCESSABLE_ENTITY,
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.UNPROCESSABLE_ENTITY,
      details,
    );
  }
}

/**
 * Error class for payment processing failures.
 * Used when payment simulation or processing fails.
 */
export class PaymentFailedError extends AppError {
  constructor(message = "Payment Failed", details: unknown | null = null) {
    super(
      ERROR_NAMES.PAYMENT_FAILED,
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.PAYMENT_FAILED,
      details,
    );
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(
      ERROR_NAMES.INTERNAL_SERVER_ERROR,
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_ERROR,
      null,
      false,
    );
  }
}
