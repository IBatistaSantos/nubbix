import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { User } from "../User";
import { Role, RoleValue } from "../vo/Role";
import { ID, Status, StatusValue, Email, ValidationError } from "@nubbix/domain";
import { InvalidResetTokenException } from "../exceptions/InvalidResetTokenException";

describe("User", () => {
  describe("constructor", () => {
    it("should create a user with default values", () => {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const accountId = ID.create().value;

      const user = new User({
        name,
        email,
        password,
        accountId,
        role: RoleValue.USER,
      });

      expect(user.id).toBeInstanceOf(ID);
      expect(user.id.value).toBeDefined();
      expect(user.name).toBe(name);
      expect(user.email).toBeInstanceOf(Email);
      expect(user.email.value).toBe(email.toLowerCase().trim());
      expect(user.password).toBe(password);
      expect(user.accountId).toBe(accountId);
      expect(user.role).toBeInstanceOf(Role);
      expect(user.role.isUser()).toBe(true);
      expect(user.status.isActive()).toBe(true);
      expect(user.avatar).toBeNull();
      expect(user.resetPasswordToken).toBeNull();
    });

    it("should create a user with all provided values", () => {
      const now = new Date();
      const id = ID.create();
      const status = Status.active();
      const role = Role.admin();
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const accountId = ID.create().value;
      const avatar = faker.image.avatar();

      const user = new User({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        status,
        name,
        email,
        password,
        accountId,
        role: role.value,
        avatar,
      });

      expect(user.id.value).toBe(id.value);
      expect(user.name).toBe(name);
      expect(user.email.value).toBe(email.toLowerCase().trim());
      expect(user.password).toBe(password);
      expect(user.accountId).toBe(accountId);
      expect(user.role.isAdmin()).toBe(true);
      expect(user.avatar).toBe(avatar);
    });

    it("should throw ValidationError for invalid email", () => {
      expect(() => {
        new User({
          name: faker.person.fullName(),
          email: "invalid-email",
          password: faker.internet.password(),
          accountId: ID.create().value,
          role: RoleValue.USER,
        });
      }).toThrow(ValidationError);
    });
  });

  describe("getters", () => {
    it("should return correct name", () => {
      const name = faker.person.fullName();
      const user = new User({
        name,
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(user.name).toBe(name);
    });

    it("should return correct email", () => {
      const email = faker.internet.email();
      const user = new User({
        name: faker.person.fullName(),
        email,
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(user.email).toBeInstanceOf(Email);
      expect(user.email.value).toBe(email.toLowerCase().trim());
    });

    it("should return correct role", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.ADMIN,
      });

      expect(user.role.isAdmin()).toBe(true);
    });
  });

  describe("update", () => {
    it("should update user name", () => {
      const oldName = faker.person.fullName();
      const newName = faker.person.fullName();
      const user = new User({
        name: oldName,
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const initialUpdatedAt = user.updatedAt;
      Bun.sleepSync(10);

      user.update({ name: newName });

      expect(user.name).toBe(newName);
      expect(user.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });

    it("should update user email", () => {
      const oldEmail = faker.internet.email();
      const newEmail = faker.internet.email();
      const user = new User({
        name: faker.person.fullName(),
        email: oldEmail,
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      user.update({ email: newEmail });

      expect(user.email.value).toBe(newEmail.toLowerCase().trim());
    });

    it("should update user avatar", () => {
      const oldAvatar = faker.image.avatar();
      const newAvatar = faker.image.avatar();
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
        avatar: oldAvatar,
      });

      user.update({ avatar: newAvatar });

      expect(user.avatar).toBe(newAvatar);
    });

    it("should allow setting avatar to null", () => {
      const avatar = faker.image.avatar();
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
        avatar,
      });

      user.update({ avatar: null });

      expect(user.avatar).toBeNull();
    });
  });

  describe("resetPassword", () => {
    it("should set reset password token and expiry", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      const expiryTimeInMs = 3600000; // 1 hour

      user.resetPassword(token, expiryTimeInMs);

      expect(user.resetPasswordToken).toBe(token);
      expect(user.resetPasswordTokenExpiresAt).toBeInstanceOf(Date);
      expect(user.resetPasswordTokenExpiresAt!.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe("isResetTokenExpired", () => {
    it("should return false if token is not set", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(user.isResetTokenExpired()).toBe(false);
    });

    it("should return false if token is not expired", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      const expiryTimeInMs = 3600000; // 1 hour
      user.resetPassword(token, expiryTimeInMs);

      expect(user.isResetTokenExpired()).toBe(false);
    });

    it("should return true if token is expired", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      const expiryTimeInMs = -1000; // Already expired
      user.resetPassword(token, expiryTimeInMs);

      expect(user.isResetTokenExpired()).toBe(true);
    });
  });

  describe("validateResetToken", () => {
    it("should throw InvalidResetTokenException when token is not set", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);

      expect(() => user.validateResetToken(token)).toThrow(InvalidResetTokenException);
    });

    it("should throw InvalidResetTokenException when token does not match", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      const wrongToken = faker.string.alphanumeric(32);
      user.resetPassword(token, 3600000);

      expect(() => user.validateResetToken(wrongToken)).toThrow(InvalidResetTokenException);
    });

    it("should throw InvalidResetTokenException when token is expired", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      user.resetPassword(token, -1000); // Already expired

      expect(() => user.validateResetToken(token)).toThrow(InvalidResetTokenException);
    });

    it("should not throw when token is valid", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      user.resetPassword(token, 3600000);

      expect(() => user.validateResetToken(token)).not.toThrow();
    });
  });

  describe("updatePassword", () => {
    it("should update password and clear reset token", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      const token = faker.string.alphanumeric(32);
      user.resetPassword(token, 3600000);

      const newPassword = faker.internet.password();
      const initialUpdatedAt = user.updatedAt;
      Bun.sleepSync(10);

      user.updatePassword(newPassword);

      expect(user.password).toBe(newPassword);
      expect(user.resetPasswordToken).toBeNull();
      expect(user.resetPasswordTokenExpiresAt).toBeNull();
      expect(user.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });

  describe("validate", () => {
    it("should pass validation for valid user", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).not.toThrow();
    });

    it("should throw ValidationError when name is empty", () => {
      const user = new User({
        name: "",
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details).toHaveLength(1);
        expect((error as ValidationError).details[0].path).toBe("name");
        expect((error as ValidationError).details[0].message).toBe("Name cannot be empty");
      }
    });

    it("should throw ValidationError when name is only whitespace", () => {
      const user = new User({
        name: "   ",
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("name");
        expect((error as ValidationError).details[0].message).toBe("Name cannot be empty");
      }
    });

    it("should throw ValidationError when name exceeds 255 characters", () => {
      const longName = "a".repeat(256);
      const user = new User({
        name: longName,
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("name");
        expect((error as ValidationError).details[0].message).toBe(
          "Name cannot exceed 255 characters"
        );
      }
    });

    it("should accept name with exactly 255 characters", () => {
      const name = "a".repeat(255);
      const user = new User({
        name,
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).not.toThrow();
    });

    it("should throw ValidationError when password is empty", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "",
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("password");
        expect((error as ValidationError).details[0].message).toBe("Password cannot be empty");
      }
    });

    it("should throw ValidationError when password is less than 8 characters", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "short",
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("password");
        expect((error as ValidationError).details[0].message).toBe(
          "Password must be at least 8 characters"
        );
      }
    });

    it("should accept password with exactly 8 characters", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "12345678",
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      expect(() => user.validate()).not.toThrow();
    });

    it("should throw ValidationError when accountId is empty", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: "",
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("accountId");
        expect((error as ValidationError).details[0].message).toBe("AccountId is required");
      }
    });

    it("should throw ValidationError when role is missing", () => {
      const user = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 10 }),
        accountId: ID.create().value,
        role: RoleValue.USER,
      });

      // Simulate missing role by setting it to undefined using reflection
      (user as any)._role = undefined;

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details[0].path).toBe("role");
        expect((error as ValidationError).details[0].message).toBe("Role is required");
      }
    });

    it("should throw multiple errors when multiple fields are invalid", () => {
      const user = new User({
        name: "",
        email: faker.internet.email(),
        password: "short",
        accountId: "",
        role: RoleValue.USER,
      });

      expect(() => user.validate()).toThrow(ValidationError);
      try {
        user.validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).details.length).toBeGreaterThan(1);
        const paths = (error as ValidationError).details.map((d) => d.path);
        expect(paths).toContain("name");
        expect(paths).toContain("password");
        expect(paths).toContain("accountId");
      }
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation with all fields", () => {
      const now = new Date();
      const id = ID.create();
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const accountId = ID.create().value;
      const avatar = faker.image.avatar();
      const token = faker.string.alphanumeric(32);

      const user = new User({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        name,
        email,
        password,
        accountId,
        role: RoleValue.USER,
        avatar,
      });

      user.resetPassword(token, 3600000);

      const json = user.toJSON();

      expect(json).toEqual({
        id: id.value,
        createdAt: now,
        updatedAt: json.updatedAt,
        deletedAt: null,
        status: StatusValue.ACTIVE,
        name,
        email: email.toLowerCase().trim(),
        avatar,
        accountId,
        password,
        role: RoleValue.USER,
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: json.resetPasswordTokenExpiresAt,
      });
    });
  });

  describe("toOutput", () => {
    it("should return output without deletedAt and sensitive fields", () => {
      const now = new Date();
      const id = ID.create();
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const accountId = ID.create().value;

      const user = new User({
        id: id.value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        name,
        email,
        password: faker.internet.password(),
        accountId,
        role: RoleValue.USER,
      });

      const output = user.toOutput();

      expect(output).not.toHaveProperty("deletedAt");
      expect(output).not.toHaveProperty("resetPasswordToken");
      expect(output).not.toHaveProperty("resetPasswordTokenExpiresAt");
      expect(output).not.toHaveProperty("password");
      expect(output.name).toBe(name);
      expect(output.email).toBe(email.toLowerCase().trim());
      expect(output.accountId).toBe(accountId);
    });
  });

  describe("asFaker", () => {
    it("should create a user with faker data", () => {
      const user = User.asFaker();

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBeInstanceOf(ID);
      expect(user.email).toBeInstanceOf(Email);
      expect(user.role).toBeInstanceOf(Role);
      expect(user.status.isActive()).toBe(true);
      expect(user.name).toBeDefined();
      expect(user.email.value).toBeDefined();
      expect(user.password).toBeDefined();
    });

    it("should allow overriding faker props", () => {
      const customName = faker.person.fullName();
      const customEmail = faker.internet.email();
      const user = User.asFaker({
        name: customName,
        email: customEmail,
      });

      expect(user.name).toBe(customName);
      expect(user.email.value).toBe(customEmail.toLowerCase().trim());
    });
  });
});
