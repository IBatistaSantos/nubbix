import { ValidationError } from "../errors/ValidationError";

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    const trimmedValue = value.trim();

    if (!trimmedValue || trimmedValue.length === 0) {
      throw new ValidationError("Email cannot be empty", [
        { path: "email", message: "Email cannot be empty" },
      ]);
    }

    // Regex básico para validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      throw new ValidationError("Invalid email format", [
        { path: "email", message: "Invalid email format" },
      ]);
    }

    return new Email(trimmedValue.toLowerCase());
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
