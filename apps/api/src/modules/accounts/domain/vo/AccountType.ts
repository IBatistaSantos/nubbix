export const AccountTypeValue = {
  TRANSACTIONAL: "TRANSACTIONAL",
  RECURRING: "RECURRING",
} as const;

export type AccountTypeValue =
  typeof AccountTypeValue[keyof typeof AccountTypeValue];

export class AccountType {
  private _value: AccountTypeValue;

  private constructor(value: AccountTypeValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static transactional() {
    return new AccountType(AccountTypeValue.TRANSACTIONAL);
  }

  static recurring() {
    return new AccountType(AccountTypeValue.RECURRING);
  }

  static fromValue(value: AccountTypeValue) {
    return new AccountType(value);
  }

  isEqualTo(accountType: AccountType) {
    return this._value === accountType.value;
  }

  isTransactional() {
    return this._value === AccountTypeValue.TRANSACTIONAL;
  }

  isRecurring() {
    return this._value === AccountTypeValue.RECURRING;
  }
}

