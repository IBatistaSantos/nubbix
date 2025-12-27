import { ValidationError } from "@nubbix/domain";

export interface AppErrorDetail {
  path?: string;
  message: string;
  code?: string;
}

export class AppError extends Error {
  public readonly errorCode: number;
  public readonly errors: AppErrorDetail[];
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    errorCode?: number,
    errors: AppErrorDetail[] = [],
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    this.errorCode = errorCode ?? 0;
    this.errors = errors;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static fromValidationError(validationError: ValidationError, statusCode: number = 400): AppError {
    return new AppError(
      validationError.message,
      undefined,
      validationError.details.map((d) => ({
        path: d.path,
        message: d.message,
      })),
      statusCode
    );
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      errors: this.errors,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
