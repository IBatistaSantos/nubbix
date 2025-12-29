import { describe, it, expect, beforeEach, mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { ForgotPasswordUseCase } from "../ForgotPasswordUseCase";
import { InMemoryUserRepository } from "../../../infrastructure/repositories/InMemoryUserRepository";
import { User, RoleValue } from "../../../domain";
import { Email, TransactionManager } from "@nubbix/domain";
import { SendNotificationUseCase } from "../../../../notifications/application/use-cases/SendNotificationUseCase";

describe("ForgotPasswordUseCase", () => {
  let useCase: ForgotPasswordUseCase;
  let userRepository: InMemoryUserRepository;
  let transactionManager: TransactionManager;
  let sendNotificationUseCase: SendNotificationUseCase;
  let sendNotificationMock: ReturnType<typeof mock>;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
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
      sendNotificationUseCase
    );
  });

  it("should send reset password email when user exists and has password", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = await Bun.password.hash(faker.internet.password());
    const name = faker.person.fullName();

    const user = User.asFaker({
      email,
      password,
      name,
      role: RoleValue.USER,
    });
    await userRepository.save(user);

    const input = {
      email,
    };

    const output = await useCase.run(input);

    expect(output.message).toBe("If the email exists, a password reset link has been sent");
    expect(sendNotificationMock).toHaveBeenCalledTimes(1);

    const savedUser = await userRepository.findByEmail(Email.create(email));
    expect(savedUser).not.toBeNull();
    expect(savedUser!.resetPasswordToken).not.toBeNull();
    expect(savedUser!.resetPasswordTokenExpiresAt).not.toBeNull();

    const notificationCall = sendNotificationMock.mock.calls[0][0];
    expect(notificationCall.context).toBe("forgot.password");
    expect(notificationCall.to.email).toBe(email.toLowerCase());
    expect(notificationCall.variables.url).toContain("/reset-password?token=");
  });

  it("should return success message even when user does not exist", async () => {
    const input = {
      email: faker.internet.email(),
    };

    const output = await useCase.run(input);

    expect(output.message).toBe("If the email exists, a password reset link has been sent");
    expect(sendNotificationMock).not.toHaveBeenCalled();
  });

  it("should generate reset token with 24h expiration", async () => {
    const email = faker.internet.email().toLowerCase();
    const password = await Bun.password.hash(faker.internet.password());

    const user = User.asFaker({
      email,
      password,
      role: RoleValue.USER,
    });
    await userRepository.save(user);

    const input = {
      email,
    };

    await useCase.run(input);

    const savedUser = await userRepository.findByEmail(Email.create(email));
    expect(savedUser!.resetPasswordToken).not.toBeNull();
    expect(savedUser!.resetPasswordTokenExpiresAt).not.toBeNull();

    const expirationTime = savedUser!.resetPasswordTokenExpiresAt!.getTime();
    const now = Date.now();
    const expectedExpiration = now + 24 * 60 * 60 * 1000; // 24 hours

    // Allow 5 seconds tolerance
    expect(Math.abs(expirationTime - expectedExpiration)).toBeLessThan(5000);
  });
});
