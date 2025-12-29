import { BadRequestError } from "../../../../shared/errors";

export class InvalidCredentialsException extends BadRequestError {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsException";
  }
}
