import { ValidationError } from "@nubbix/domain";

export class Slug {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Slug {
    if (!value || value.trim().length === 0) {
      throw new ValidationError("Slug cannot be empty", [
        { path: "slug", message: "Slug cannot be empty" },
      ]);
    }

    if (/\s/.test(value)) {
      throw new ValidationError("Slug cannot contain spaces", [
        { path: "slug", message: "Slug cannot contain spaces" },
      ]);
    }

    // Permite apenas letras, números, hífen e underscore
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      throw new ValidationError("Slug can only contain letters, numbers, hyphens and underscores", [
        {
          path: "slug",
          message: "Slug can only contain letters, numbers, hyphens and underscores",
        },
      ]);
    }

    return new Slug(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Slug): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
