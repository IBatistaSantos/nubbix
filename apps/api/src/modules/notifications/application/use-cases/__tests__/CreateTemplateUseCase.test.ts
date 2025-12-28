import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { CreateTemplateUseCase } from "../CreateTemplateUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { Template } from "../../../domain";
import { TemplateContext, Language } from "../../../domain/vo";
import { ConflictError } from "../../../../../shared/errors";

describe("CreateTemplateUseCase", () => {
  let useCase: CreateTemplateUseCase;
  let templateRepository: InMemoryTemplateRepository;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    useCase = new CreateTemplateUseCase(templateRepository);
  });

  it("should create template successfully", async () => {
    const input = {
      channel: "email" as const,
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      context: "account.welcome" as const,
      language: "pt-BR" as const,
      accountId: null,
      isDefault: true,
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("id");
    expect(output.channel).toBe("email");
    expect(output.subject).toBe(input.subject);
    expect(output.body).toBe(input.body);
    expect(output.context).toBe("account.welcome");
    expect(output.language).toBe("pt-BR");
    expect(output.isDefault).toBe(true);
  });

  it("should create template with attachments", async () => {
    const input = {
      channel: "email" as const,
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      context: "account.welcome" as const,
      language: "pt-BR" as const,
      attachments: [
        {
          url: faker.internet.url(),
          type: "image" as const,
          filename: "logo.png",
          mimeType: "image/png",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output.attachments).toBeDefined();
    expect(output.attachments?.length).toBe(1);
    expect(output.attachments?.[0].url).toBe(input.attachments[0].url);
  });

  it("should throw ConflictError when template already exists", async () => {
    const existingTemplate = Template.asFaker({
      context: TemplateContext.accountWelcome(),
      language: Language.ptBR(),
      accountId: null,
    });
    await templateRepository.save(existingTemplate);

    const input = {
      channel: "email" as const,
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      context: "account.welcome" as const,
      language: "pt-BR" as const,
      accountId: null,
    };

    await expect(useCase.run(input)).rejects.toThrow(ConflictError);
  });

  it("should set isDefault to true when accountId is null", async () => {
    const input = {
      channel: "email" as const,
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      context: "account.welcome" as const,
      language: "pt-BR" as const,
      accountId: null,
    };

    const output = await useCase.run(input);

    expect(output.isDefault).toBe(true);
  });
});
