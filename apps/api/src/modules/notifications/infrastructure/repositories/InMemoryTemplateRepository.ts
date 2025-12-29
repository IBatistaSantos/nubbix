import { ID } from "@nubbix/domain";
import { Template, TemplateRepository } from "../../domain";
import { TemplateContext, Language, Channel } from "../../domain/vo";

export class InMemoryTemplateRepository implements TemplateRepository {
  private templates: Map<string, Template> = new Map();

  async findById(id: ID): Promise<Template | null> {
    const template = this.templates.get(id.value);
    if (!template || template.deletedAt) {
      return null;
    }
    return template;
  }

  async save(entity: Template): Promise<Template> {
    this.templates.set(entity.id.value, entity);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    const template = this.templates.get(id.value);
    if (template) {
      template.deactivate();
      this.templates.set(id.value, template);
    }
  }

  async exists(id: ID): Promise<boolean> {
    const template = this.templates.get(id.value);
    return template !== undefined && !template.deletedAt;
  }

  async findByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<Template | null> {
    for (const template of this.templates.values()) {
      // Skip deleted templates
      if (template.deletedAt !== null) {
        continue;
      }

      // Check if context and language match
      if (template.context.value !== context.value || template.language.value !== language.value) {
        continue;
      }

      // If accountId is provided (not undefined, not null, not empty string), match it exactly
      // Otherwise, match templates with accountId === null
      const hasAccountId = accountId !== undefined && accountId !== null && accountId !== "";
      if (hasAccountId) {
        if (template.accountId === accountId) {
          return template;
        }
      } else {
        if (template.accountId === null) {
          return template;
        }
      }
    }
    return null;
  }

  async findByContextLanguageAndChannel(
    context: TemplateContext,
    language: Language,
    channel: Channel,
    accountId?: string | null
  ): Promise<Template | null> {
    for (const template of this.templates.values()) {
      // Skip deleted templates
      if (template.deletedAt !== null) {
        continue;
      }

      // Check if context, language, and channel match
      if (
        template.context.value !== context.value ||
        template.language.value !== language.value ||
        template.channel.value !== channel.value
      ) {
        continue;
      }

      // If accountId is provided (not undefined, not null, not empty string), match it exactly
      // Otherwise, match templates with accountId === null
      const hasAccountId = accountId !== undefined && accountId !== null && accountId !== "";
      if (hasAccountId) {
        if (template.accountId === accountId) {
          return template;
        }
      } else {
        if (template.accountId === null) {
          return template;
        }
      }
    }
    return null;
  }

  async findDefaultByContextAndLanguage(
    context: TemplateContext,
    language: Language
  ): Promise<Template | null> {
    for (const template of this.templates.values()) {
      // Skip deleted templates
      if (template.deletedAt !== null) {
        continue;
      }

      // Check all conditions
      if (
        template.context.value === context.value &&
        template.language.value === language.value &&
        template.accountId === null &&
        template.isDefault
      ) {
        return template;
      }
    }
    return null;
  }

  async findDefaultByContextLanguageAndChannel(
    context: TemplateContext,
    language: Language,
    channel: Channel
  ): Promise<Template | null> {
    for (const template of this.templates.values()) {
      // Skip deleted templates
      if (template.deletedAt !== null) {
        continue;
      }

      // Check all conditions
      if (
        template.context.value === context.value &&
        template.language.value === language.value &&
        template.channel.value === channel.value &&
        template.accountId === null &&
        template.isDefault
      ) {
        return template;
      }
    }
    return null;
  }

  async findByAccountId(accountId: string): Promise<Template[]> {
    const result: Template[] = [];
    for (const template of this.templates.values()) {
      if (template.deletedAt === null && template.accountId === accountId) {
        result.push(template);
      }
    }
    return result;
  }

  async existsByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<boolean> {
    const template = await this.findByContextAndLanguage(context, language, accountId);
    return template !== null;
  }
}
