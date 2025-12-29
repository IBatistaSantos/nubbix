import { describe, it, expect, beforeEach } from "bun:test";
import { SetPasswordUseCase } from "../SetPasswordUseCase";
import { InMemoryUserRepository } from "../../../../identity/infrastructure/repositories/InMemoryUserRepository";
import { BunPasswordHasher } from "../../../infrastructure/services/BunPasswordHasher";
import { User } from "../../../../identity/domain";
import { TransactionManager } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("SetPasswordUseCase", () => {
  let useCase: SetPasswordUseCase;
  let userRepository: InMemoryUserRepository;
  let passwordHasher: BunPasswordHasher;
  let transactionManager: TransactionManager;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordHasher = new BunPasswordHasher();
    transactionManager = {
      runInTransaction: async <T>(callback: (tx: unknown) => Promise<T>): Promise<T> => {
        return await callback(null);
      },
    };
    useCase = new SetPasswordUseCase(userRepository, passwordHasher, transactionManager);
  });

  it("should set password successfully when token is valid", async () => {
    const token = "valid-token-123";
    const newPassword = "newPassword123";
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("userId");
    expect(output).toHaveProperty("email");
    expect(output.userId).toBe(user.id.value);
    expect(output.email).toBe(user.email.value);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.password).not.toBeNull();
    expect(updatedUser!.resetPasswordToken).toBeNull();
    expect(updatedUser!.resetPasswordTokenExpiresAt).toBeNull();
  });

  it("should hash password before saving", async () => {
    const token = "valid-token-123";
    const newPassword = "newPassword123";
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
    };

    await useCase.run(input);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser!.password).not.toBe(newPassword);
    expect(updatedUser!.password).toContain("$2");
  });

  it("should clear token and expiry after setting password", async () => {
    const token = "valid-token-123";
    const newPassword = "newPassword123";
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
    };

    await useCase.run(input);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser!.resetPasswordToken).toBeNull();
    expect(updatedUser!.resetPasswordTokenExpiresAt).toBeNull();
  });

  it("should throw error when token is invalid", async () => {
    const token = "valid-token-123";
    const invalidToken = "invalid-token";
    const newPassword = "newPassword123";
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token: invalidToken,
      password: newPassword,
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when token expired", async () => {
    const token = "expired-token";
    const newPassword = "newPassword123";
    const TOKEN_EXPIRY_MS = -1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw error when token does not exist", async () => {
    const input = {
      token: "non-existent-token",
      password: "newPassword123",
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should validate password format (minimum 8 characters)", async () => {
    const token = "valid-token-123";
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: "short",
    };

    await expect(useCase.run(input)).rejects.toThrow();
  });

  it("should update user updatedAt timestamp", async () => {
    const token = "valid-token-123";
    const newPassword = "newPassword123";
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

    const user = User.asFaker({
      password: null,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    const originalUpdatedAt = user.updatedAt;
    await userRepository.save(user);

    await new Promise((resolve) => setTimeout(resolve, 10));

    const input = {
      token,
      password: newPassword,
    };

    await useCase.run(input);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
