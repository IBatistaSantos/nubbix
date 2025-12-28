import { BaseUseCase, createZodValidator } from "@nubbix/domain";
import { TemplateRepository } from "../../domain";
import { TemplateContext, Language } from "../../domain/vo";
import {
  GetTemplateByContextInput,
  GetTemplateByContextOutput,
  getTemplateByContextSchema,
} from "../dtos/GetTemplateByContextDTO";
import { NotFoundError } from "../../../../shared/errors";

export class GetTemplateByContextUseCase extends BaseUseCase<
  GetTemplateByContextInput,
  GetTemplateByContextOutput
> {
  constructor(private templateRepository: TemplateRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<GetTemplateByContextInput>> {
    // @ts-ignore
    return createZodValidator(getTemplateByContextSchema);
  }

  protected async execute(input: GetTemplateByContextInput): Promise<GetTemplateByContextOutput> {
    const context = TemplateContext.fromValue(input.context as any);
    const language = Language.fromValue(input.language as any);

    let template = null;

    if (input.accountId) {
      template = await this.templateRepository.findByContextAndLanguage(
        context,
        language,
        input.accountId
      );
    }

    if (!template) {
      template = await this.templateRepository.findDefaultByContextAndLanguage(context, language);
    }

    if (!template) {
      throw new NotFoundError(
        `Template not found for context: ${input.context}, language: ${input.language}`
      );
    }

    return template.toJSON();
  }
}
