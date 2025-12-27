import { v7 as uuidv7 } from "uuid";

export class ID {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value?: string): ID {
    if (value) {
      return new ID(value);
    }
    return new ID(uuidv7());
  }

  get value(): string {
    return this._value;
  }

  equals(other: ID): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

