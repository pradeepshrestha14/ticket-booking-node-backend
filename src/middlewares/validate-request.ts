import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

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
