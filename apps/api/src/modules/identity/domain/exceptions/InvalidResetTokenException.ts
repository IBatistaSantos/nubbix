export class InvalidResetTokenException extends Error {
  constructor() {
    super(`Invalid or expired reset token`);
    this.name = "InvalidResetTokenException";
  }
}

