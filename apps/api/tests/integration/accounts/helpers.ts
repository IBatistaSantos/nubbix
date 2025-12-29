import { UseCaseTester } from "../core/useCaseTester";
import { CreateAccountUseCase } from "../../../src/modules/accounts/application/use-cases/CreateAccountUseCase";
import { SetPasswordUseCase } from "../../../src/modules/accounts/application/use-cases/SetPasswordUseCase";
import { DrizzleAccountRepository } from "../../../src/modules/accounts/infrastructure/repositories/DrizzleAccountRepository";
import { DrizzleUserRepository } from "../../../src/modules/identity/infrastructure/repositories/DrizzleUserRepository";
import { BunPasswordHasher } from "../../../src/modules/accounts/infrastructure/services/BunPasswordHasher";
import { DrizzleTransactionManager } from "../../../src/shared/infrastructure/transactions";
import type { CreateAccountInput } from "../../../src/modules/accounts/application/dtos/CreateAccountDTO";
import type { SetPasswordInput } from "../../../src/modules/accounts/application/dtos/SetPasswordDTO";
import { faker } from "@faker-js/faker";
import { AccountTypeValue } from "../../../src/modules/accounts/domain";
import { SendNotificationUseCase } from "../../../src/modules/notifications/application/use-cases/SendNotificationUseCase";
import { DrizzleTemplateRepository } from "../../../src/modules/notifications/infrastructure/repositories/DrizzleTemplateRepository";
import { InMemoryNotificationRepository } from "../../../src/modules/notifications/infrastructure/repositories/InMemoryNotificationRepository";
import { NotificationProvider } from "../../../src/modules/notifications/domain/services/NotificationProvider";
import { Notification } from "../../../src/modules/notifications/domain/Notification";
import { Channel } from "../../../src/modules/notifications/domain";

class MockNotificationProvider implements NotificationProvider {
  async send(_notification: Notification): Promise<string> {
    return "mock-message-id";
  }
}

function createMockSendNotificationUseCase(db: any): SendNotificationUseCase {
  const templateRepository = new DrizzleTemplateRepository(db);
  const notificationRepository = new InMemoryNotificationRepository();
  const notificationProvider = new MockNotificationProvider();

  return new SendNotificationUseCase(
    templateRepository,
    notificationRepository,
    notificationProvider
  );
}

export function createAccountUseCaseFactory(db: any): CreateAccountUseCase {
  const sendNotificationUseCase = createMockSendNotificationUseCase(db);
  return new CreateAccountUseCase(
    new DrizzleAccountRepository(db),
    new DrizzleUserRepository(db),
    new DrizzleTransactionManager(db),
    sendNotificationUseCase
  );
}

export function createAccountInput(overrides?: Partial<CreateAccountInput>): CreateAccountInput {
  return {
    accountName: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
    accountType: AccountTypeValue.TRANSACTIONAL,
    responsibleName: faker.person.fullName(),
    responsibleEmail: faker.internet.email(),
    ...overrides,
  };
}

export function createAccountTester() {
  return new UseCaseTester<CreateAccountInput, { accountId: string; slug: string }>({
    useCaseFactory: createAccountUseCaseFactory,
    execute: async (useCase: CreateAccountUseCase, input: CreateAccountInput) => {
      return await useCase.run(input);
    },
  });
}

export function createSetPasswordUseCaseFactory(db: any) {
  return new SetPasswordUseCase(
    new DrizzleUserRepository(db),
    new BunPasswordHasher(),
    new DrizzleTransactionManager(db)
  );
}

export function createSetPasswordInput(overrides?: Partial<SetPasswordInput>): SetPasswordInput {
  return {
    token: "test-token-123",
    password: "testPassword123",
    ...overrides,
  };
}

export function createSetPasswordTester() {
  return new UseCaseTester<SetPasswordInput, { userId: string; email: string }>({
    useCaseFactory: createSetPasswordUseCaseFactory,
    execute: async (useCase: SetPasswordUseCase, input: SetPasswordInput) => {
      return await useCase.run(input);
    },
  });
}
