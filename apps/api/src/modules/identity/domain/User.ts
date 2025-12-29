import { BaseEntity, BaseProps, ValidationError, Email, ID } from "@nubbix/domain";
import { faker } from "@faker-js/faker";
import { Role, RoleValue } from "./vo/Role";
import { InvalidResetTokenException } from "./exceptions/InvalidResetTokenException";

interface UserProps extends BaseProps {
  name: string;
  email: string;
  password: string | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiresAt?: Date | null;
  accountId: string;
  role: RoleValue;
  avatar?: string;
}

type UserUpdateData = Omit<
  UserProps,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "status"
  | "role"
  | "accountId"
  | "resetPasswordToken"
  | "avatar"
> & {
  avatar?: string | null;
};

export class User extends BaseEntity {
  private _name: string;
  private _email: Email;
  private _password: string | null;
  private _resetPasswordToken?: string | null;
  private _resetPasswordTokenExpiresAt?: Date | null;
  private _avatar: string | null;
  private _accountId: string;
  private _role: Role;

  constructor(props: UserProps) {
    super(props);
    this._name = props.name;
    this._email = Email.create(props.email);
    this._password = props.password;
    this._resetPasswordToken = props.resetPasswordToken ?? null;
    this._resetPasswordTokenExpiresAt = props.resetPasswordTokenExpiresAt ?? null;
    this._avatar = props.avatar ?? null;
    this._accountId = props.accountId;
    this._role = Role.fromValue(props.role);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get avatar() {
    return this._avatar;
  }

  get accountId() {
    return this._accountId;
  }

  get role() {
    return this._role;
  }

  get resetPasswordToken() {
    return this._resetPasswordToken;
  }

  get resetPasswordTokenExpiresAt() {
    return this._resetPasswordTokenExpiresAt;
  }

  validate(): void {
    const errors: Array<{ path: string; message: string }> = [];

    if (!this._name || this._name.trim().length === 0) {
      errors.push({
        path: "name",
        message: "Name cannot be empty",
      });
    }

    if (this._name && this._name.length > 255) {
      errors.push({
        path: "name",
        message: "Name cannot exceed 255 characters",
      });
    }

    if (!this._email) {
      errors.push({
        path: "email",
        message: "Email is required",
      });
    }

    if (this._password !== null && this._password !== undefined) {
      if (this._password.trim().length === 0) {
        errors.push({
          path: "password",
          message: "Password cannot be empty",
        });
      } else if (this._password.length < 8) {
        errors.push({
          path: "password",
          message: "Password must be at least 8 characters",
        });
      }
    }

    if (!this._accountId || this._accountId.trim().length === 0) {
      errors.push({
        path: "accountId",
        message: "AccountId is required",
      });
    }

    if (!this._role) {
      errors.push({
        path: "role",
        message: "Role is required",
      });
    }

    if (errors.length > 0) {
      throw new ValidationError("User validation failed", errors);
    }
  }

  update(props: Partial<UserUpdateData>) {
    if (props.name !== undefined) this._name = props.name;
    if (props.email !== undefined) this._email = Email.create(props.email);
    if (props.avatar !== undefined) this._avatar = props.avatar;
    this._updatedAt = new Date();
  }

  resetPassword(token: string, expiryTimeInMs: number) {
    this._resetPasswordToken = token;
    this._resetPasswordTokenExpiresAt = new Date(Date.now() + expiryTimeInMs);
    this._updatedAt = new Date();
  }

  isResetTokenExpired(): boolean {
    if (!this._resetPasswordTokenExpiresAt) {
      return false;
    }
    return Date.now() > this._resetPasswordTokenExpiresAt.getTime();
  }

  validateResetToken(token: string): void {
    if (!this._resetPasswordToken) {
      throw new InvalidResetTokenException();
    }

    if (this._resetPasswordToken !== token) {
      throw new InvalidResetTokenException();
    }

    if (this.isResetTokenExpired()) {
      throw new InvalidResetTokenException();
    }
  }

  updatePassword(password: string | null) {
    this._password = password;
    this._resetPasswordToken = null;
    this._resetPasswordTokenExpiresAt = null;
    this._updatedAt = new Date();
  }

  static asFaker(overrides?: Partial<UserProps>): User {
    const baseProps = this.generateBaseFakerProps();

    return new User({
      ...baseProps,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      accountId: ID.create().value,
      role: RoleValue.USER,
      avatar: faker.image.avatar(),
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
      ...overrides,
    });
  }

  toOutput() {
    const { deletedAt: _deletedAt, ...json } = super.toJSON();
    return {
      ...json,
      name: this._name,
      email: this._email.value,
      avatar: this._avatar,
      accountId: this._accountId,
      role: this._role.value,
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this._name,
      email: this._email.value,
      password: this._password,
      avatar: this._avatar,
      accountId: this._accountId,
      role: this._role.value,
      resetPasswordToken: this._resetPasswordToken,
      resetPasswordTokenExpiresAt: this._resetPasswordTokenExpiresAt,
    };
  }
}
