export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required. Please sign in.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Requested resource was not found.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input data provided.", details?: string) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "A resource with these details already exists.") {
    super(message, 409, "CONFLICT");
  }
}

export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: string;
  };
};

export function formatErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    const res: ErrorResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    };
    if (error.details !== undefined) {
      res.error.details = error.details;
    }
    return res;
  }

  const err = error as Error;
  console.error("[ServerError]", err?.stack || err);
  return {
    success: false,
    error: {
      message: "An unexpected server error occurred.",
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    },
  };
}
