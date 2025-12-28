export const ProviderValue = {
  TWILIO: "twilio",
  SENDGRID: "sendgrid",
  RESEND: "resend",
  CUSTOM: "custom",
} as const;

export type ProviderValue = (typeof ProviderValue)[keyof typeof ProviderValue];

export class Provider {
  private _value: ProviderValue;

  private constructor(value: ProviderValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static twilio() {
    return new Provider(ProviderValue.TWILIO);
  }

  static sendgrid() {
    return new Provider(ProviderValue.SENDGRID);
  }

  static resend() {
    return new Provider(ProviderValue.RESEND);
  }

  static custom() {
    return new Provider(ProviderValue.CUSTOM);
  }

  static fromValue(value: ProviderValue) {
    return new Provider(value);
  }

  isEqualTo(provider: Provider) {
    return this._value === provider.value;
  }

  isTwilio() {
    return this._value === ProviderValue.TWILIO;
  }

  isSendgrid() {
    return this._value === ProviderValue.SENDGRID;
  }

  isResend() {
    return this._value === ProviderValue.RESEND;
  }

  isCustom() {
    return this._value === ProviderValue.CUSTOM;
  }
}
