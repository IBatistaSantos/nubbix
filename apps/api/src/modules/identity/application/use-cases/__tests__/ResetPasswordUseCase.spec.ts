import { describe, it, expect, beforeEach, mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { ResetPasswordUseCase } from "../ResetPasswordUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { User, RoleValue } from "../../../domain";
import { Email, TransactionManager } from "@nubbix/domain";
import { PasswordHasher } from "../../../../accounts/application/services/PasswordHasher";
import { NotFoundError } from "../../../../../shared/errors";
import { randomBytes } from "crypto";
import { Account } from "../../../../accounts/domain";
import { InMemoryAccountRepository } from "../../../../accounts/infrastructure/repositories/InMemoryAccountRepository";

describe("ResetPasswordUseCase", () => {
  let useCase: ResetPasswordUseCase;
  let userRepository: InMemoryUserRepository;
  let accountRepository: InMemoryAccountRepository;
  let passwordHasher: PasswordHasher;
  let transactionManager: TransactionManager;
  let hashMock: ReturnType<typeof mock>;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    accountRepository = new InMemoryAccountRepository();
    hashMock = mock(async (password: string) => {
      return `hashed-${password}`;
    });
    passwordHasher = {
      hash: hashMock,
      verify: mock(() => Promise.resolve(true)),
    } as any;

    transactionManager = {
      runInTransaction: async <T>(callback: (tx: unknown) => Promise<T>): Promise<T> => {
        return await callback(null);
      },
    };

    useCase = new ResetPasswordUseCase(
      userRepository,
      passwordHasher,
      transactionManager,
      accountRepository
    );
  });

  it("should reset password successfully with valid token", async () => {
    const email = faker.internet.email().toLowerCase();
    const token = randomBytes(32).toString("hex");
    const newPassword = faker.internet.password({ length: 10 });
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: await Bun.password.hash("oldPassword"),
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
      accountSlug: account.slug.value,
    };

    const output = await useCase.run(input);

    expect(output.userId).toBe(user.id.value);
    expect(output.email).toBe(email.toLowerCase());
    expect(hashMock).toHaveBeenCalledTimes(1);
    expect(hashMock).toHaveBeenCalledWith(newPassword);

    const savedUser = await userRepository.findByEmailAndAccountId(Email.create(email), account.id);
    expect(savedUser!.password).toBe(`hashed-${newPassword}`);
    expect(savedUser!.resetPasswordToken).toBeNull();
    expect(savedUser!.resetPasswordTokenExpiresAt).toBeNull();
  });

  it("should throw NotFoundError when token does not exist", async () => {
    const account = Account.asFaker();
    await accountRepository.save(account);

    const input = {
      token: randomBytes(32).toString("hex"),
      password: faker.internet.password({ length: 10 }),
      accountSlug: account.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError when token is invalid", async () => {
    const email = faker.internet.email().toLowerCase();
    const validToken = randomBytes(32).toString("hex");
    const invalidToken = randomBytes(32).toString("hex");
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: await Bun.password.hash("oldPassword"),
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    user.resetPassword(validToken, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token: invalidToken,
      password: faker.internet.password({ length: 10 }),
      accountSlug: account.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError when token is expired", async () => {
    const email = faker.internet.email().toLowerCase();
    const token = randomBytes(32).toString("hex");
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: await Bun.password.hash("oldPassword"),
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    // Set token to expire in the past
    user.resetPassword(token, -1000);
    await userRepository.save(user);

    const input = {
      token,
      password: faker.internet.password({ length: 10 }),
      accountSlug: account.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should clear reset token after successful password reset", async () => {
    const email = faker.internet.email().toLowerCase();
    const token = randomBytes(32).toString("hex");
    const newPassword = faker.internet.password({ length: 10 });
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password: await Bun.password.hash("oldPassword"),
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
      accountSlug: account.slug.value,
    };

    await useCase.run(input);

    const savedUser = await userRepository.findByEmailAndAccountId(Email.create(email), account.id);
    expect(savedUser!.resetPasswordToken).toBeNull();
    expect(savedUser!.resetPasswordTokenExpiresAt).toBeNull();
  });

  it("should throw NotFoundError when user belongs to different account", async () => {
    const email = faker.internet.email().toLowerCase();
    const token = randomBytes(32).toString("hex");
    const newPassword = faker.internet.password({ length: 10 });
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
    const account1 = Account.asFaker();
    const account2 = Account.asFaker();
    await accountRepository.save(account1);
    await accountRepository.save(account2);

    const user = User.asFaker({
      email,
      password: await Bun.password.hash("oldPassword"),
      role: RoleValue.USER,
      accountId: account1.id.value,
    });
    user.resetPassword(token, TOKEN_EXPIRY_MS);
    await userRepository.save(user);

    const input = {
      token,
      password: newPassword,
      accountSlug: account2.slug.value,
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });
});
