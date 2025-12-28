export const TemplateContextValue = {
  ACCOUNT_WELCOME: "account.welcome",
  PARTICIPANT_REGISTRATION: "participant.registration",
  FORGOT_PASSWORD: "forgot.password",
} as const;

export type TemplateContextValue = (typeof TemplateContextValue)[keyof typeof TemplateContextValue];

export class TemplateContext {
  private _value: TemplateContextValue;

  private constructor(value: TemplateContextValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static accountWelcome() {
    return new TemplateContext(TemplateContextValue.ACCOUNT_WELCOME);
  }

  static participantRegistration() {
    return new TemplateContext(TemplateContextValue.PARTICIPANT_REGISTRATION);
  }

  static forgotPassword() {
    return new TemplateContext(TemplateContextValue.FORGOT_PASSWORD);
  }

  static fromValue(value: TemplateContextValue) {
    return new TemplateContext(value);
  }

  isEqualTo(context: TemplateContext) {
    return this._value === context.value;
  }

  isAccountWelcome() {
    return this._value === TemplateContextValue.ACCOUNT_WELCOME;
  }

  isParticipantRegistration() {
    return this._value === TemplateContextValue.PARTICIPANT_REGISTRATION;
  }

  isForgotPassword() {
    return this._value === TemplateContextValue.FORGOT_PASSWORD;
  }
}
