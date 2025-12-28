import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { z } from "zod";
import { TemplateRepository } from "../../domain";
import { GetTemplateOutput } from "../dtos/GetTemplateDTO";
import { NotFoundError } from "../../../../shared/errors";

const templateIdSchema = z.string().uuid("Invalid template ID format");

export class GetTemplateUseCase extends BaseUseCase<string, GetTemplateOutput> {
  constructor(private templateRepository: TemplateRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<string>> {
    // @ts-ignore
    return createZodValidator(templateIdSchema);
  }

  protected async execute(templateId: string): Promise<GetTemplateOutput> {
    const id = ID.create(templateId);
    const template = await this.templateRepository.findById(id);

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    return template.toJSON();
  }
}
