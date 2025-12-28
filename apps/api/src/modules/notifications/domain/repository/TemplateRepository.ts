import { Repository } from "@nubbix/domain";
import { Template } from "../Template";
import { TemplateContext } from "../vo/TemplateContext";
import { Language } from "../vo/Language";

export interface TemplateRepository extends Repository<Template> {
  findByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<Template | null>;
  findDefaultByContextAndLanguage(
    context: TemplateContext,
    language: Language
  ): Promise<Template | null>;
  findByAccountId(accountId: string): Promise<Template[]>;
  existsByContextAndLanguage(
    context: TemplateContext,
    language: Language,
    accountId?: string | null
  ): Promise<boolean>;
}
