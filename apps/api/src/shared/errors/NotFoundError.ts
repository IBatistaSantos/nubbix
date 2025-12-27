import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string, errorCode?: number, errors: AppError["errors"] = []) {
    super(message, errorCode, errors, 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

