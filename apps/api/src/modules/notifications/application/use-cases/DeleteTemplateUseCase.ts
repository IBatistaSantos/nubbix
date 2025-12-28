import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { z } from "zod";
import { TemplateRepository } from "../../domain";
import { NotFoundError } from "../../../../shared/errors";

const templateIdSchema = z.string().uuid("Invalid template ID format");

export class DeleteTemplateUseCase extends BaseUseCase<string, void> {
  constructor(private templateRepository: TemplateRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<string>> {
    // @ts-ignore
    return createZodValidator(templateIdSchema);
  }

  protected async execute(templateId: string): Promise<void> {
    const id = ID.create(templateId);
    const template = await this.templateRepository.findById(id);

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    await this.templateRepository.delete(id);
  }
}
