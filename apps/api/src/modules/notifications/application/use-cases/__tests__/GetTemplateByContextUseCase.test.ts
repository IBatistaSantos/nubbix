import { describe, it, expect, beforeEach } from "bun:test";
import { GetTemplateByContextUseCase } from "../GetTemplateByContextUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { Template, TemplateContext, Language } from "../../../domain";
import { NotFoundError } from "../../../../../shared/errors";
import { faker } from "@faker-js/faker";

describe("GetTemplateByContextUseCase", () => {
  let useCase: GetTemplateByContextUseCase;
  let templateRepository: InMemoryTemplateRepository;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    useCase = new GetTemplateByContextUseCase(templateRepository);
  });

  it("should get template by accountId, context and language", async () => {
    const accountId = faker.string.uuid();
    const template = Template.asFaker({
      accountId,
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
    });
    await templateRepository.save(template);

    const input = {
      context: "account.welcome",
      language: "pt-BR",
      accountId,
    };

    const output = await useCase.run(input);

    expect(output.id).toBe(template.id.value);
    expect(output.accountId).toBe(accountId);
  });

  it("should fallback to default template when accountId template not found", async () => {
    const defaultTemplate = Template.asFaker({
      accountId: null,
      isDefault: true,
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
    });
    await templateRepository.save(defaultTemplate);

    const input = {
      context: "account.welcome",
      language: "pt-BR",
      accountId: faker.string.uuid(),
    };

    const output = await useCase.run(input);

    expect(output.id).toBe(defaultTemplate.id.value);
    expect(output.accountId).toBeNull();
    expect(output.isDefault).toBe(true);
  });

  it("should prefer accountId template over default", async () => {
    const accountId = faker.string.uuid();
    const accountTemplate = Template.asFaker({
      accountId,
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
    });
    const defaultTemplate = Template.asFaker({
      accountId: null,
      isDefault: true,
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
    });

    await templateRepository.save(accountTemplate);
    await templateRepository.save(defaultTemplate);

    const input = {
      context: "account.welcome",
      language: "pt-BR",
      accountId,
    };

    const output = await useCase.run(input);

    expect(output.id).toBe(accountTemplate.id.value);
    expect(output.accountId).toBe(accountId);
  });

  it("should throw NotFoundError when no template found", async () => {
    const input = {
      context: "account.welcome",
      language: "en-US",
      accountId: faker.string.uuid(),
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should get default template when accountId is not provided", async () => {
    const defaultTemplate = Template.asFaker({
      accountId: null,
      isDefault: true,
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
    });
    await templateRepository.save(defaultTemplate);

    const input = {
      context: "account.welcome",
      language: "pt-BR",
    };

    const output = await useCase.run(input);

    expect(output.id).toBe(defaultTemplate.id.value);
    expect(output.isDefault).toBe(true);
  });
});
