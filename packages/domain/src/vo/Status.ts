export enum StatusValue {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export class Status {
  private readonly _value: StatusValue;

  private constructor(value: StatusValue) {
    this._value = value;
  }

  static active(): Status {
    return new Status(StatusValue.ACTIVE);
  }

  static inactive(): Status {
    return new Status(StatusValue.INACTIVE);
  }

  get value(): StatusValue {
    return this._value;
  }

  isActive(): boolean {
    return this._value === StatusValue.ACTIVE;
  }

  isInactive(): boolean {
    return this._value === StatusValue.INACTIVE;
  }

  equals(other: Status): boolean {
    return this._value === other._value;
  }
}

