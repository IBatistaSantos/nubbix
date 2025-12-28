import { Repository } from "@nubbix/domain";
import { Template } from "../Template";
import { TemplateContext } from "../vo/TemplateContext";
import { Language } from "../vo/Language";
import { Channel } from "../vo/Channel";

export interface TemplateRepository extends Repository<Template> {
  findByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<Template | null>;
  findByContextLanguageAndChannel(
    context: TemplateContext,
    language: Language,
    channel: Channel,
    accountId?: string | null
  ): Promise<Template | null>;
  findDefaultByContextAndLanguage(
    context: TemplateContext,
    language: Language
  ): Promise<Template | null>;
  findDefaultByContextLanguageAndChannel(
    context: TemplateContext,
    language: Language,
    channel: Channel
  ): Promise<Template | null>;
  findByAccountId(accountId: string): Promise<Template[]>;
  existsByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<boolean>;
}
