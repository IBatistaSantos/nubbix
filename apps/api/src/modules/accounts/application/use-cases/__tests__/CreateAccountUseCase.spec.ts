import { describe, it, expect, beforeEach, mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { CreateAccountUseCase } from "../CreateAccountUseCase";
import { InMemoryAccountRepository } from "../../../infrastructure/repositories/InMemoryAccountRepository";
import { InMemoryUserRepository } from "../../../../identity/infrastructure/repositories/InMemoryUserRepository";
import { Account, AccountTypeValue } from "../../../domain";
import { ID, TransactionManager, Email } from "@nubbix/domain";
import { ConflictError } from "../../../../../shared/errors";
import { SendNotificationUseCase } from "../../../../notifications/application/use-cases/SendNotificationUseCase";

describe("CreateAccountUseCase", () => {
  let useCase: CreateAccountUseCase;
  let accountRepository: InMemoryAccountRepository;
  let userRepository: InMemoryUserRepository;
  let transactionManager: TransactionManager;
  let sendNotificationUseCase: SendNotificationUseCase;
  let sendNotificationMock: ReturnType<typeof mock>;

  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
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
    useCase = new CreateAccountUseCase(
      accountRepository,
      userRepository,
      transactionManager,
      sendNotificationUseCase
    );
  });

  it("should create account and super admin user successfully", async () => {
    const input = {
      accountName: faker.company.name(),
      slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      logo: faker.image.url(),
      accountType: AccountTypeValue.TRANSACTIONAL as AccountTypeValue,
      responsibleName: faker.person.fullName(),
      responsibleEmail: faker.internet.email(),
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("accountId");
    expect(output).toHaveProperty("slug");
    expect(output.slug).toBe(input.slug);

    const user = await userRepository.findByEmail(Email.create(input.responsibleEmail));
    expect(user).not.toBeNull();
    expect(user!.password).toBeNull();
    expect(user!.resetPasswordToken).not.toBeNull();
    expect(user!.resetPasswordTokenExpiresAt).not.toBeNull();
    expect(sendNotificationMock).toHaveBeenCalledTimes(1);
    const notificationCall = sendNotificationMock.mock.calls[0][0];
    expect(notificationCall.context).toBe("account.welcome");
    expect(notificationCall.to.email).toBe(input.responsibleEmail);
    expect(notificationCall.variables.url).toContain("/onboarding?token=");
  });

  it("should create account with minimal required fields", async () => {
    const input = {
      accountName: faker.company.name(),
      slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
      accountType: AccountTypeValue.RECURRING as AccountTypeValue,
      responsibleName: faker.person.fullName(),
      responsibleEmail: faker.internet.email(),
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("accountId");
    expect(output).toHaveProperty("slug");

    const user = await userRepository.findByEmail(Email.create(input.responsibleEmail));
    expect(user).not.toBeNull();
    expect(user!.password).toBeNull();
    expect(user!.resetPasswordToken).not.toBeNull();
  });

  it("should throw error when slug already exists", async () => {
    const slug = faker.helpers.slugify(faker.company.name()).toLowerCase();
    const existingAccount = Account.asFaker({
      slug,
    });
    await accountRepository.save(existingAccount);

    const input = {
      accountName: faker.company.name(),
      slug,
      accountType: AccountTypeValue.TRANSACTIONAL as AccountTypeValue,
      responsibleName: faker.person.fullName(),
      responsibleEmail: faker.internet.email(),
    };

    await expect(useCase.run(input)).rejects.toThrow(ConflictError);
  });

  it("should handle empty optional fields correctly", async () => {
    const input = {
      accountName: faker.company.name(),
      slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
      description: "",
      website: "",
      logo: "",
      accountType: AccountTypeValue.TRANSACTIONAL as AccountTypeValue,
      responsibleName: faker.person.fullName(),
      responsibleEmail: faker.internet.email(),
    };

    const output = await useCase.run(input);

    const account = await accountRepository.findById(ID.create(output.accountId));
    expect(account).not.toBeNull();
    expect(account!.description).toBeNull();
    expect(account!.website).toBeNull();
    expect(account!.logo).toBeNull();
  });
});
