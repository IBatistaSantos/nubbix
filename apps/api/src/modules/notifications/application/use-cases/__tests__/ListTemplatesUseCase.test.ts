import { describe, it, expect, beforeEach } from "bun:test";
import { ListTemplatesUseCase } from "../ListTemplatesUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { Template, TemplateContext } from "../../../domain";
import { Language } from "../../../domain/vo";
import { faker } from "@faker-js/faker";

describe("ListTemplatesUseCase", () => {
  let useCase: ListTemplatesUseCase;
  let templateRepository: InMemoryTemplateRepository;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    useCase = new ListTemplatesUseCase(templateRepository);
  });

  it("should list templates by accountId", async () => {
    const accountId = faker.string.uuid();
    const template1 = Template.asFaker({
      accountId,
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
    });
    const template2 = Template.asFaker({
      accountId,
      context: TemplateContext.participantRegistration(),
      language: Language.enUS(),
    });
    await templateRepository.save(template1);
    await templateRepository.save(template2);

    const query = {
      accountId,
    };

    const output = await useCase.run(query);

    expect(output.templates.length).toBeGreaterThanOrEqual(2);
    expect(output.total).toBeGreaterThanOrEqual(2);
    expect(output.templates.some((t) => t.id === template1.id.value)).toBe(true);
    expect(output.templates.some((t) => t.id === template2.id.value)).toBe(true);
  });

  it("should filter by context", async () => {
    const accountId = faker.string.uuid();
    const template1 = Template.asFaker({
      accountId,
      context: TemplateContext.accountWelcome(),
    });
    const template2 = Template.asFaker({
      accountId,
      context: TemplateContext.forgotPassword(),
    });

    await templateRepository.save(template1);
    await templateRepository.save(template2);

    const query = {
      accountId,
      context: "account.welcome",
    };

    const output = await useCase.run(query);

    expect(output.templates.length).toBe(1);
    expect(output.templates[0].context).toBe("account.welcome");
  });

  it("should paginate results", async () => {
    const accountId = faker.string.uuid();
    const contexts = [
      TemplateContext.accountWelcome(),
      TemplateContext.participantRegistration(),
      TemplateContext.forgotPassword(),
    ];
    const languages = [Language.ptBR(), Language.enUS(), Language.esES()];

    for (let i = 0; i < 5; i++) {
      const context = contexts[i % contexts.length];
      const language = languages[Math.floor(i / contexts.length) % languages.length];
      await templateRepository.save(Template.asFaker({ accountId, context, language }));
    }

    const query = {
      accountId,
      page: 1,
      limit: 2,
    };

    const output = await useCase.run(query);

    expect(output.templates.length).toBe(2);
    expect(output.total).toBeGreaterThanOrEqual(5);
    expect(output.page).toBe(1);
    expect(output.limit).toBe(2);
  });
});
