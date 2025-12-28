export const NotificationStatusValue = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
} as const;

export type NotificationStatusValue =
  (typeof NotificationStatusValue)[keyof typeof NotificationStatusValue];

export class NotificationStatus {
  private _value: NotificationStatusValue;

  private constructor(value: NotificationStatusValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static pending() {
    return new NotificationStatus(NotificationStatusValue.PENDING);
  }

  static sent() {
    return new NotificationStatus(NotificationStatusValue.SENT);
  }

  static failed() {
    return new NotificationStatus(NotificationStatusValue.FAILED);
  }

  static fromValue(value: NotificationStatusValue) {
    return new NotificationStatus(value);
  }

  isEqualTo(status: NotificationStatus) {
    return this._value === status.value;
  }

  isPending() {
    return this._value === NotificationStatusValue.PENDING;
  }

  isSent() {
    return this._value === NotificationStatusValue.SENT;
  }

  isFailed() {
    return this._value === NotificationStatusValue.FAILED;
  }
}
