import { UseCaseTester } from "../../core/useCaseTester";
import { CreateTemplateUseCase } from "../../../../src/modules/notifications/application/use-cases/CreateTemplateUseCase";
import { UpdateTemplateUseCase } from "../../../../src/modules/notifications/application/use-cases/UpdateTemplateUseCase";
import { GetTemplateUseCase } from "../../../../src/modules/notifications/application/use-cases/GetTemplateUseCase";
import { ListTemplatesUseCase } from "../../../../src/modules/notifications/application/use-cases/ListTemplatesUseCase";
import { DeleteTemplateUseCase } from "../../../../src/modules/notifications/application/use-cases/DeleteTemplateUseCase";
import { GetTemplateByContextUseCase } from "../../../../src/modules/notifications/application/use-cases/GetTemplateByContextUseCase";
import { DrizzleTemplateRepository } from "../../../../src/modules/notifications/infrastructure/repositories/DrizzleTemplateRepository";
import type { CreateTemplateInput } from "../../../../src/modules/notifications/application/dtos/CreateTemplateDTO";
import type { UpdateTemplateInput } from "../../../../src/modules/notifications/application/dtos/UpdateTemplateDTO";
import type { ListTemplatesQuery } from "../../../../src/modules/notifications/application/dtos/ListTemplatesDTO";
import type { GetTemplateByContextInput } from "../../../../src/modules/notifications/application/dtos/GetTemplateByContextDTO";
import { faker } from "@faker-js/faker";

export function createTemplateUseCaseFactory(db: any) {
  const repository = new DrizzleTemplateRepository(db);
  return new CreateTemplateUseCase(repository);
}

export function createUpdateTemplateUseCaseFactory(db: any) {
  const repository = new DrizzleTemplateRepository(db);
  return new UpdateTemplateUseCase(repository);
}

export function createGetTemplateUseCaseFactory(db: any) {
  const repository = new DrizzleTemplateRepository(db);
  return new GetTemplateUseCase(repository);
}

export function createListTemplatesUseCaseFactory(db: any) {
  const repository = new DrizzleTemplateRepository(db);
  return new ListTemplatesUseCase(repository);
}

export function createDeleteTemplateUseCaseFactory(db: any) {
  const repository = new DrizzleTemplateRepository(db);
  return new DeleteTemplateUseCase(repository);
}

export function createGetTemplateByContextUseCaseFactory(db: any) {
  const repository = new DrizzleTemplateRepository(db);
  return new GetTemplateByContextUseCase(repository);
}

let templateCounter = 0;

export function createTemplateInput(overrides?: Partial<CreateTemplateInput>): CreateTemplateInput {
  const contexts: Array<"account.welcome" | "participant.registration" | "forgot.password"> = [
    "account.welcome",
    "participant.registration",
    "forgot.password",
  ];
  const languages: Array<"pt-BR" | "en-US" | "es-ES"> = ["pt-BR", "en-US", "es-ES"];

  templateCounter += 1;
  const contextIndex = templateCounter % contexts.length;
  const languageIndex = Math.floor(templateCounter / contexts.length) % languages.length;

  return {
    channel: "email",
    subject: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    context: overrides?.context ?? contexts[contextIndex],
    language: overrides?.language ?? languages[languageIndex],
    accountId:
      overrides?.accountId ?? (overrides?.accountId === undefined ? faker.string.uuid() : null),
    isDefault: overrides?.isDefault ?? (overrides?.accountId === null ? true : false),
    ...overrides,
  };
}

export function createTemplateTester() {
  return new UseCaseTester<CreateTemplateInput, any>({
    useCaseFactory: createTemplateUseCaseFactory,
    execute: async (useCase: CreateTemplateUseCase, input: CreateTemplateInput) => {
      return await useCase.run(input);
    },
  });
}

export function createUpdateTemplateTester() {
  return new UseCaseTester<UpdateTemplateInput, any>({
    useCaseFactory: createUpdateTemplateUseCaseFactory,
    execute: async (useCase: UpdateTemplateUseCase, input: UpdateTemplateInput) => {
      return await useCase.run(input);
    },
  });
}

export function createGetTemplateTester() {
  return new UseCaseTester<string, any>({
    useCaseFactory: createGetTemplateUseCaseFactory,
    execute: async (useCase: GetTemplateUseCase, input: string) => {
      return await useCase.run(input);
    },
  });
}

export function createListTemplatesTester() {
  return new UseCaseTester<ListTemplatesQuery, any>({
    useCaseFactory: createListTemplatesUseCaseFactory,
    execute: async (useCase: ListTemplatesUseCase, input: ListTemplatesQuery) => {
      return await useCase.run(input);
    },
  });
}

export function createDeleteTemplateTester() {
  return new UseCaseTester<string, void>({
    useCaseFactory: createDeleteTemplateUseCaseFactory,
    execute: async (useCase: DeleteTemplateUseCase, input: string) => {
      return await useCase.run(input);
    },
  });
}

export function createGetTemplateByContextTester() {
  return new UseCaseTester<GetTemplateByContextInput, any>({
    useCaseFactory: createGetTemplateByContextUseCaseFactory,
    execute: async (useCase: GetTemplateByContextUseCase, input: GetTemplateByContextInput) => {
      return await useCase.run(input);
    },
  });
}
