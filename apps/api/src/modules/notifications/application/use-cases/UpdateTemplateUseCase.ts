import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { TemplateRepository } from "../../domain";
import { AttachmentType } from "../../domain/vo";
import { Attachment } from "../../domain/types/Attachment";
import {
  UpdateTemplateInput,
  UpdateTemplateOutput,
  updateTemplateSchema,
} from "../dtos/UpdateTemplateDTO";
import { NotFoundError } from "../../../../shared/errors";

export class UpdateTemplateUseCase extends BaseUseCase<UpdateTemplateInput, UpdateTemplateOutput> {
  constructor(private templateRepository: TemplateRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<UpdateTemplateInput>> {
    // @ts-ignore
    return createZodValidator(updateTemplateSchema);
  }

  protected async execute(input: UpdateTemplateInput): Promise<UpdateTemplateOutput> {
    const id = ID.create(input.templateId);
    const template = await this.templateRepository.findById(id);

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    const updateData: {
      subject?: string;
      body?: string;
      attachments?: Attachment[];
    } = {};

    if (input.subject !== undefined) {
      updateData.subject = input.subject;
    }

    if (input.body !== undefined) {
      updateData.body = input.body;
    }

    if (input.attachments !== undefined) {
      updateData.attachments = input.attachments.map((att) => ({
        url: att.url,
        type: AttachmentType.fromValue(att.type as any),
        filename: att.filename,
        mimeType: att.mimeType,
      }));
    }

    template.update(updateData);
    template.validate();

    await this.templateRepository.save(template);

    return template.toJSON();
  }
}
