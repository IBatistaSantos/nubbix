export const EventTypeValue = {
  DIGITAL: "digital",
  HYBRID: "hybrid",
  IN_PERSON: "in-person",
} as const;

export type EventTypeValue = (typeof EventTypeValue)[keyof typeof EventTypeValue];

export class EventType {
  private _value: EventTypeValue;

  private constructor(value: EventTypeValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static digital() {
    return new EventType(EventTypeValue.DIGITAL);
  }

  static hybrid() {
    return new EventType(EventTypeValue.HYBRID);
  }

  static inPerson() {
    return new EventType(EventTypeValue.IN_PERSON);
  }

  static fromValue(value: EventTypeValue) {
    return new EventType(value);
  }

  isEqualTo(eventType: EventType) {
    return this._value === eventType.value;
  }

  isDigital() {
    return this._value === EventTypeValue.DIGITAL;
  }

  isHybrid() {
    return this._value === EventTypeValue.HYBRID;
  }

  isInPerson() {
    return this._value === EventTypeValue.IN_PERSON;
  }
}
