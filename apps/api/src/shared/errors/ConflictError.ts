import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message: string, errorCode?: number, errors: AppError["errors"] = []) {
    super(message, errorCode, errors, 409);
    this.name = "ConflictError";
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
