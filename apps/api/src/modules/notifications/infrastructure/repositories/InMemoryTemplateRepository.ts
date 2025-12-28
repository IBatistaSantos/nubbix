import { ID } from "@nubbix/domain";
import { Template, TemplateRepository } from "../../domain";
import { TemplateContext, Language } from "../../domain/vo";

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
      if (
        template.deletedAt === null &&
        template.context.value === context.value &&
        template.language.value === language.value &&
        (accountId !== undefined ? template.accountId === accountId : template.accountId === null)
      ) {
        return template;
      }
    }
    return null;
  }

  async findDefaultByContextAndLanguage(
    context: TemplateContext,
    language: Language
  ): Promise<Template | null> {
    for (const template of this.templates.values()) {
      if (
        template.deletedAt === null &&
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
