import { describe, it, expect, beforeEach } from "bun:test";
import { GetTemplateUseCase } from "../GetTemplateUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { Template } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("GetTemplateUseCase", () => {
  let useCase: GetTemplateUseCase;
  let templateRepository: InMemoryTemplateRepository;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    useCase = new GetTemplateUseCase(templateRepository);
  });

  it("should get template successfully", async () => {
    const template = Template.asFaker();
    await templateRepository.save(template);

    const output = await useCase.run(template.id.value);

    expect(output.id).toBe(template.id.value);
    expect(output.channel).toBe(template.channel.value);
    expect(output.body).toBe(template.body);
    expect(output.context).toBe(template.context.value);
    expect(output.language).toBe(template.language.value);
  });

  it("should throw NotFoundError when template does not exist", async () => {
    const nonExistentId = ID.create().value;

    await expect(useCase.run(nonExistentId)).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError when template is deleted", async () => {
    const template = Template.asFaker();
    await templateRepository.save(template);
    await templateRepository.delete(template.id);

    await expect(useCase.run(template.id.value)).rejects.toThrow(NotFoundError);
  });
});
