import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string, errorCode?: number, errors: AppError["errors"] = []) {
    super(message, errorCode, errors, 400);
    this.name = "BadRequestError";
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

