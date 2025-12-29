import { ValidationError } from "@nubbix/domain";

const EVENT_URL_PATTERN = /^[a-zA-Z0-9_-]+$/;

export class EventUrl {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): EventUrl {
    if (!value || value.trim().length === 0) {
      throw new ValidationError("Event URL cannot be empty", [
        { path: "url", message: "Event URL cannot be empty" },
      ]);
    }

    if (/\s/.test(value)) {
      throw new ValidationError("Event URL cannot contain spaces", [
        { path: "url", message: "Event URL cannot contain spaces" },
      ]);
    }

    if (!EVENT_URL_PATTERN.test(value)) {
      throw new ValidationError(
        "Event URL can only contain letters, numbers, hyphens and underscores",
        [
          {
            path: "url",
            message: "Event URL can only contain letters, numbers, hyphens and underscores",
          },
        ]
      );
    }

    return new EventUrl(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: EventUrl): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
