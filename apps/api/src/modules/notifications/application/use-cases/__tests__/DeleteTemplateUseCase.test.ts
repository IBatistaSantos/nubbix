import { describe, it, expect, beforeEach } from "bun:test";
import { DeleteTemplateUseCase } from "../DeleteTemplateUseCase";
import { InMemoryTemplateRepository } from "../../../infrastructure/repositories/InMemoryTemplateRepository";
import { Template } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("DeleteTemplateUseCase", () => {
  let useCase: DeleteTemplateUseCase;
  let templateRepository: InMemoryTemplateRepository;

  beforeEach(() => {
    templateRepository = new InMemoryTemplateRepository();
    useCase = new DeleteTemplateUseCase(templateRepository);
  });

  it("should delete template successfully", async () => {
    const template = Template.asFaker();
    await templateRepository.save(template);

    await useCase.run(template.id.value);

    const deletedTemplate = await templateRepository.findById(template.id);
    expect(deletedTemplate).toBeNull();
  });

  it("should throw NotFoundError when template does not exist", async () => {
    const nonExistentId = ID.create().value;

    await expect(useCase.run(nonExistentId)).rejects.toThrow(NotFoundError);
  });
});
