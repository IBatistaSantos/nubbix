import { CreateTemplateUseCase } from "../../application/use-cases/CreateTemplateUseCase";
import { UpdateTemplateUseCase } from "../../application/use-cases/UpdateTemplateUseCase";
import { GetTemplateUseCase } from "../../application/use-cases/GetTemplateUseCase";
import { ListTemplatesUseCase } from "../../application/use-cases/ListTemplatesUseCase";
import { DeleteTemplateUseCase } from "../../application/use-cases/DeleteTemplateUseCase";
import { GetTemplateByContextUseCase } from "../../application/use-cases/GetTemplateByContextUseCase";
import { DrizzleTemplateRepository } from "../repositories/DrizzleTemplateRepository";

let templateRepository: DrizzleTemplateRepository | null = null;

export function createCreateTemplateUseCase(): CreateTemplateUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }
  return new CreateTemplateUseCase(templateRepository);
}

export function createUpdateTemplateUseCase(): UpdateTemplateUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }
  return new UpdateTemplateUseCase(templateRepository);
}

export function createGetTemplateUseCase(): GetTemplateUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }
  return new GetTemplateUseCase(templateRepository);
}

export function createListTemplatesUseCase(): ListTemplatesUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }
  return new ListTemplatesUseCase(templateRepository);
}

export function createDeleteTemplateUseCase(): DeleteTemplateUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }
  return new DeleteTemplateUseCase(templateRepository);
}

export function createGetTemplateByContextUseCase(): GetTemplateByContextUseCase {
  if (!templateRepository) {
    templateRepository = new DrizzleTemplateRepository();
  }
  return new GetTemplateByContextUseCase(templateRepository);
}
