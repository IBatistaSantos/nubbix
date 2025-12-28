import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { Template, TemplateRepository } from "../../domain";
import { Channel, TemplateContext, Language, AttachmentType } from "../../domain/vo";
import { Attachment } from "../../domain/types/Attachment";
import {
  CreateTemplateInput,
  CreateTemplateOutput,
  createTemplateSchema,
} from "../dtos/CreateTemplateDTO";
import { ConflictError } from "../../../../shared/errors";

export class CreateTemplateUseCase extends BaseUseCase<CreateTemplateInput, CreateTemplateOutput> {
  constructor(private templateRepository: TemplateRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<CreateTemplateInput>> {
    // @ts-ignore
    return createZodValidator(createTemplateSchema);
  }

  protected async execute(input: CreateTemplateInput): Promise<CreateTemplateOutput> {
    const channel = Channel.fromValue(input.channel);
    const context = TemplateContext.fromValue(input.context);
    const language = Language.fromValue(input.language);

    const accountId = input.accountId ?? null;
    const isDefault = input.isDefault ?? (accountId === null ? true : false);

    const exists = await this.templateRepository.existsByContextAndLanguage(
      context,
      language,
      accountId
    );

    if (exists) {
      throw new ConflictError("Template with this context, language and accountId already exists");
    }

    const attachments: Attachment[] =
      input.attachments?.map((att) => ({
        url: att.url,
        type: AttachmentType.fromValue(att.type),
        filename: att.filename,
        mimeType: att.mimeType,
      })) ?? [];

    const template = new Template({
      id: ID.create().value,
      channel,
      subject: input.subject || "",
      body: input.body,
      context,
      language,
      accountId,
      isDefault,
      attachments,
    });

    template.validate();

    await this.templateRepository.save(template);

    return template.toJSON();
  }
}
