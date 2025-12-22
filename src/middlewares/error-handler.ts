import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HTTP_STATUS, ERROR_NAMES, ERROR_CODES } from "@/constants";
import { AppError, logger } from "@/utils";

/**
 * Global Express error handler middleware.
 * Handles all types of errors (operational, validation, database, etc.) and returns consistent JSON responses.
 * Logs errors for monitoring and debugging.
 * @param err The error object caught by Express
 * @param _req Express request object (unused)
 * @param res Express response object
 * @param _next Express next function (unused - this is the final handler)
 */
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  /**
   * 1️⃣ Known operational errors (AppError)
   */
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        name: err.name,
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  /**
   * 2️⃣ Zod validation errors
   */
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        name: ERROR_NAMES.BAD_REQUEST,
        code: ERROR_CODES.BAD_REQUEST,
        message: "Validation failed",
        details: err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    });
  }

  // ------------------------
  // Handle body-parser JSON syntax errors
  // ------------------------
  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: {
        name: ERROR_NAMES.BAD_REQUEST,
        code: ERROR_CODES.BAD_REQUEST,
        message: err.message,
      },
    });
  }

  const appError = err as AppError;
  // Log details
  if (appError.isOperational) {
    logger.warn(`${appError.name}: ${appError.message}`);
  } else {
    logger.error(err, "Global Error Handler: Unexpected error occurred");
  }

  /**
   * 3️⃣ Unknown / programming / library errors
   *    (DO NOT leak internal details)
   */
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      name: ERROR_NAMES.INTERNAL_SERVER_ERROR,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Internal server error",
    },
  });
}
