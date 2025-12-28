import { BaseUseCase, createZodValidator } from "@nubbix/domain";
import { Template, TemplateRepository } from "../../domain";
import { TemplateContext, Language } from "../../domain/vo";
import {
  ListTemplatesQuery,
  ListTemplatesOutput,
  listTemplatesQuerySchema,
} from "../dtos/ListTemplatesDTO";

const ALL_CONTEXTS = [
  TemplateContext.accountWelcome(),
  TemplateContext.participantRegistration(),
  TemplateContext.forgotPassword(),
];

const ALL_LANGUAGES = [Language.ptBR(), Language.enUS(), Language.esES()];

export class ListTemplatesUseCase extends BaseUseCase<ListTemplatesQuery, ListTemplatesOutput> {
  constructor(private templateRepository: TemplateRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<ListTemplatesQuery>> {
    // @ts-ignore
    return createZodValidator(listTemplatesQuerySchema);
  }

  protected async execute(query: ListTemplatesQuery): Promise<ListTemplatesOutput> {
    const contexts = this.getContexts(query.context);
    const languages = this.getLanguages(query.language);

    const templatePromises = contexts.flatMap((context) =>
      languages.map((language) => this.findTemplate(context, language, query.accountId))
    );

    const templates = (await Promise.all(templatePromises)).filter(
      (template): template is Template => template !== null
    );

    return this.buildResponse(templates, query);
  }

  private getContexts(contextValue?: string): TemplateContext[] {
    return contextValue ? [TemplateContext.fromValue(contextValue as any)] : ALL_CONTEXTS;
  }

  private getLanguages(languageValue?: string): Language[] {
    return languageValue ? [Language.fromValue(languageValue as any)] : ALL_LANGUAGES;
  }

  private async findTemplate(
    context: TemplateContext,
    language: Language,
    accountId: string
  ): Promise<Template | null> {
    const accountTemplate = await this.templateRepository.findByContextAndLanguage(
      context,
      language,
      accountId
    );

    if (accountTemplate) {
      return accountTemplate;
    }

    return this.templateRepository.findDefaultByContextAndLanguage(context, language);
  }

  private buildResponse(templates: Template[], query: ListTemplatesQuery): ListTemplatesOutput {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const startIndex = (page - 1) * limit;
    const paginatedTemplates = templates.slice(startIndex, startIndex + limit);

    return {
      templates: paginatedTemplates.map((template) => {
        const json = template.toJSON();
        return {
          id: json.id,
          channel: json.channel,
          subject: json.subject || undefined,
          body: json.body,
          context: json.context,
          language: json.language,
          accountId: json.accountId ?? undefined,
          isDefault: json.isDefault,
          attachments: json.attachments?.length ? json.attachments : undefined,
          createdAt: json.createdAt,
          updatedAt: json.updatedAt,
        };
      }),
      total: templates.length,
      page,
      limit,
    };
  }
}
