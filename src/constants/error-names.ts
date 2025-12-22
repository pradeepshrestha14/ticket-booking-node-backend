export const ERROR_NAMES = {
  BAD_REQUEST: "BadRequestError",
  UNAUTHORIZED: "UnauthorizedError",
  FORBIDDEN: "ForbiddenError",
  NOT_FOUND: "NotFoundError",
  CONFLICT: "ConflictError",
  UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
  PAYMENT_FAILED: "PaymentFailedError",
  VALIDATION: "ValidationError",
  INTERNAL_SERVER_ERROR: "InternalServerError",
} as const;

export type ErrorName = (typeof ERROR_NAMES)[keyof typeof ERROR_NAMES];
