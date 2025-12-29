import { describe, it, expect, beforeEach, mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { ForgotPasswordUseCase } from "../ForgotPasswordUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { User, RoleValue } from "../../../domain";
import { Email, TransactionManager } from "@nubbix/domain";
import { SendNotificationUseCase } from "../../../../notifications/application/use-cases/SendNotificationUseCase";
import { Account } from "../../../../accounts/domain";
import { InMemoryAccountRepository } from "../../../../accounts/infrastructure/repositories/InMemoryAccountRepository";

describe("ForgotPasswordUseCase", () => {
  let useCase: ForgotPasswordUseCase;
  let userRepository: InMemoryUserRepository;
  let accountRepository: InMemoryAccountRepository;
  let transactionManager: TransactionManager;
  let sendNotificationUseCase: SendNotificationUseCase;
  let sendNotificationMock: ReturnType<typeof mock>;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    accountRepository = new InMemoryAccountRepository();
    transactionManager = {
      runInTransaction: async <T>(callback: (tx: unknown) => Promise<T>): Promise<T> => {
        return await callback(null);
      },
    };
    sendNotificationMock = mock(() => Promise.resolve({} as any));
    sendNotificationUseCase = {
      run: sendNotificationMock,
    } as any;

    useCase = new ForgotPasswordUseCase(
      userRepository,
      transactionManager,
      sendNotificationUseCase,
      accountRepository
    );
  });

  it("should send reset password email when user exists and has password", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = await Bun.password.hash(faker.internet.password());
    const name = faker.person.fullName();
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password,
      name,
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      accountSlug: account.slug.value,
    };

    const output = await useCase.run(input);

    expect(output.message).toBe("If the email exists, a password reset link has been sent");
    expect(sendNotificationMock).toHaveBeenCalledTimes(1);

    const savedUser = await userRepository.findByEmailAndAccountId(Email.create(email), account.id);
    expect(savedUser).not.toBeNull();
    expect(savedUser!.resetPasswordToken).not.toBeNull();
    expect(savedUser!.resetPasswordTokenExpiresAt).not.toBeNull();

    const notificationCall = sendNotificationMock.mock.calls[0][0];
    expect(notificationCall.context).toBe("forgot.password");
    expect(notificationCall.to.email).toBe(email.toLowerCase());
    expect(notificationCall.variables.url).toContain(`${account.slug.value}`);
    expect(notificationCall.variables.url).toContain(`reset-password`);
    expect(notificationCall.variables.url).toContain(`token=`);
  });

  it("should return success message even when user does not exist", async () => {
    const account = Account.asFaker();
    await accountRepository.save(account);

    const input = {
      email: faker.internet.email(),
      accountSlug: account.slug.value,
    };

    const output = await useCase.run(input);

    expect(output.message).toBe("If the email exists, a password reset link has been sent");
    expect(sendNotificationMock).not.toHaveBeenCalled();
  });

  it("should generate reset token with 24h expiration", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = await Bun.password.hash(faker.internet.password());
    const account = Account.asFaker();
    await accountRepository.save(account);

    const user = User.asFaker({
      email,
      password,
      role: RoleValue.USER,
      accountId: account.id.value,
    });
    await userRepository.save(user);

    const input = {
      email,
      accountSlug: account.slug.value,
    };

    await useCase.run(input);

    const savedUser = await userRepository.findByEmailAndAccountId(Email.create(email), account.id);
    expect(savedUser!.resetPasswordToken).not.toBeNull();
    expect(savedUser!.resetPasswordTokenExpiresAt).not.toBeNull();

    const expirationTime = savedUser!.resetPasswordTokenExpiresAt!.getTime();
    const now = Date.now();
    const expectedExpiration = now + 24 * 60 * 60 * 1000; // 24 hours

    // Allow 5 seconds tolerance
    expect(Math.abs(expirationTime - expectedExpiration)).toBeLessThan(5000);
  });

  it("should return success message when account does not exist", async () => {
    const input = {
      email: faker.internet.email(),
      accountSlug: "non-existent-account",
    };

    const output = await useCase.run(input);

    expect(output.message).toBe("If the email exists, a password reset link has been sent");
    expect(sendNotificationMock).not.toHaveBeenCalled();
  });
});
