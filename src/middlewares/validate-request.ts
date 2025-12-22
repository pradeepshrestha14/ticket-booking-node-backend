import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware factory for request body validation using Zod schemas.
 * Parses and validates request body against the provided schema.
 * If validation fails, passes the error to the next middleware.
 * If validation succeeds, replaces req.body with the parsed data.
 * @param schema Zod schema to validate the request body against
 * @returns Express middleware function
 */
export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data as T;
    next();
  };
