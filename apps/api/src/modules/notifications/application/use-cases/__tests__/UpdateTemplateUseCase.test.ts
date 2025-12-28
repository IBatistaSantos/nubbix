import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { UpdateTemplateUseCase } from "../UpdateTemplateUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { Template } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("UpdateTemplateUseCase", () => {
  let useCase: UpdateTemplateUseCase;
  let templateRepository: InMemoryTemplateRepository;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    useCase = new UpdateTemplateUseCase(templateRepository);
  });

  it("should update template successfully", async () => {
    const template = Template.asFaker();
    await templateRepository.save(template);

    const input = {
      templateId: template.id.value,
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    };

    const output = await useCase.run(input);

    expect(output.id).toBe(template.id.value);
    expect(output.subject).toBe(input.subject);
    expect(output.body).toBe(input.body);
  });

  it("should update only provided fields", async () => {
    const template = Template.asFaker();
    await templateRepository.save(template);

    const newSubject = faker.lorem.sentence();
    const input = {
      templateId: template.id.value,
      subject: newSubject,
    };

    const output = await useCase.run(input);

    expect(output.subject).toBe(newSubject);
    expect(output.body).toBe(template.body);
  });

  it("should throw NotFoundError when template does not exist", async () => {
    const input = {
      templateId: ID.create().value,
      subject: faker.lorem.sentence(),
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should update attachments", async () => {
    const template = Template.asFaker();
    await templateRepository.save(template);

    const input = {
      templateId: template.id.value,
      attachments: [
        {
          url: faker.internet.url(),
          type: "image" as const,
          filename: "new-logo.png",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output.attachments).toBeDefined();
    expect(output.attachments?.length).toBe(1);
    expect(output.attachments?.[0].url).toBe(input.attachments[0].url);
  });
});
