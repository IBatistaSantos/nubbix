import { UseCaseTester } from "../core/useCaseTester";
import { CreateAccountUseCase } from "../../../src/modules/accounts/application/use-cases/CreateAccountUseCase";
import { DrizzleAccountRepository } from "../../../src/modules/accounts/infrastructure/repositories/DrizzleAccountRepository";
import { DrizzleUserRepository } from "../../../src/modules/identity/infrastructure/repositories/DrizzleUserRepository";
import { BunPasswordHasher } from "../../../src/modules/accounts/infrastructure/services/BunPasswordHasher";
import { DrizzleTransactionManager } from "../../../src/shared/infrastructure/transactions";
import type { CreateAccountInput } from "../../../src/modules/accounts/application/dtos/CreateAccountDTO";
import { faker } from "@faker-js/faker";
import { AccountTypeValue } from "../../../src/modules/accounts/domain";

export function createAccountUseCaseFactory(db: any) {
  return new CreateAccountUseCase(
    new DrizzleAccountRepository(db),
    new DrizzleUserRepository(db),
    new BunPasswordHasher(),
    new DrizzleTransactionManager(db)
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
