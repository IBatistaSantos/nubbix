import { Status, StatusValue } from "@nubbix/domain";
import { eq, and, isNull } from "drizzle-orm";
import { Template, TemplateRepository } from "../../domain";
import { Channel, TemplateContext, Language, AttachmentType } from "../../domain/vo";
import { Attachment } from "../../domain/types/Attachment";
import { templates } from "../../../../shared/infrastructure/db/schema";
import { BaseDrizzleRepository } from "../../../../shared/infrastructure/repositories/BaseDrizzleRepository";

type TemplateSchema = typeof templates.$inferSelect;

export class DrizzleTemplateRepository
  extends BaseDrizzleRepository<Template, TemplateSchema>
  implements TemplateRepository
{
  protected getTable() {
    return templates;
  }

  protected toDomain(schema: TemplateSchema): Template {
    const status = schema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();

    const attachments: Attachment[] = (schema.attachments || []).map((att) => ({
      url: att.url,
      type: AttachmentType.fromValue(att.type as any),
      filename: att.filename,
      mimeType: att.mimeType,
    }));

    return new Template({
      id: schema.id,
      channel: Channel.fromValue(schema.channel),
      subject: schema.subject || "",
      body: schema.body,
      context: TemplateContext.fromValue(schema.context),
      language: Language.fromValue(schema.language),
      accountId: schema.accountId ?? null,
      isDefault: schema.isDefault,
      attachments,
      status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: schema.deletedAt ?? null,
    });
  }

  protected toSchema(entity: Template): Partial<TemplateSchema> & { id: string } {
    return {
      id: entity.id.value,
      channel: entity.channel.value as any,
      subject: entity.subject || null,
      body: entity.body,
      context: entity.context.value as any,
      language: entity.language.value as any,
      accountId: entity.accountId ?? null,
      isDefault: entity.isDefault,
      attachments:
        entity.attachments.length > 0
          ? entity.attachments.map((att) => ({
              url: att.url,
              type: att.type.value,
              filename: att.filename,
              mimeType: att.mimeType,
            }))
          : null,
      status: entity.status.value as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  async findByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<Template | null> {
    const conditions = [
      eq(templates.context, context.value as any),
      eq(templates.language, language.value as any),
      isNull(templates.deletedAt),
    ];

    if (accountId !== undefined && accountId !== null) {
      conditions.push(eq(templates.accountId, accountId));
    } else {
      conditions.push(isNull(templates.accountId));
    }

    const result = await this.db
      .select()
      .from(templates)
      .where(and(...conditions))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async findDefaultByContextAndLanguage(
    context: TemplateContext,
    language: Language
  ): Promise<Template | null> {
    const result = await this.db
      .select()
      .from(templates)
      .where(
        and(
          eq(templates.context, context.value as any),
          eq(templates.language, language.value as any),
          isNull(templates.accountId),
          eq(templates.isDefault, true),
          isNull(templates.deletedAt)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async findByAccountId(accountId: string): Promise<Template[]> {
    const result = await this.db
      .select()
      .from(templates)
      .where(and(eq(templates.accountId, accountId), isNull(templates.deletedAt)));

    return result.map((row) => this.toDomain(row));
  }

  async existsByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<boolean> {
    const conditions = [
      eq(templates.context, context.value as any),
      eq(templates.language, language.value as any),
      isNull(templates.deletedAt),
    ];

    if (accountId !== undefined && accountId !== null) {
      conditions.push(eq(templates.accountId, accountId));
    } else {
      conditions.push(isNull(templates.accountId));
    }

    const result = await this.db
      .select()
      .from(templates)
      .where(and(...conditions))
      .limit(1);

    return result.length > 0;
  }
}
