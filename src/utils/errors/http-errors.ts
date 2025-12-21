import { AppError } from "./AppError";
import { HTTP_STATUS, ERROR_CODES, ERROR_NAMES } from "../../constants";

/*
 * Specific HTTP Error Classes
 * These classes extend the base AppError to represent common HTTP error scenarios.
 * Each class sets appropriate default values for name, status, code, and message.
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

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(ERROR_NAMES.UNAUTHORIZED, message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(ERROR_NAMES.FORBIDDEN, message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(ERROR_NAMES.NOT_FOUND, message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details: string | null = null) {
    super(ERROR_NAMES.CONFLICT, message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, details);
  }
}

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
