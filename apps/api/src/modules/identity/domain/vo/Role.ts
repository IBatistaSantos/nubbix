export const RoleValue = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type RoleValue = (typeof RoleValue)[keyof typeof RoleValue];

export class Role {
  private _value: RoleValue;

  private constructor(value: RoleValue) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static user() {
    return new Role(RoleValue.USER);
  }

  static admin() {
    return new Role(RoleValue.ADMIN);
  }

  static superAdmin() {
    return new Role(RoleValue.SUPER_ADMIN);
  }

  static fromValue(value: RoleValue) {
    return new Role(value);
  }

  isEqualTo(role: Role) {
    return this._value === role.value;
  }

  isUser() {
    return this._value === RoleValue.USER;
  }

  isAdmin() {
    return this._value === RoleValue.ADMIN;
  }

  isSuperAdmin() {
    return this._value === RoleValue.SUPER_ADMIN;
  }
}
