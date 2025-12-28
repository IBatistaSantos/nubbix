import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createListTemplatesUseCase } from "../../infrastructure/di/TemplateUseCaseFactory";
import { ListTemplatesQuery } from "../../application/dtos/ListTemplatesDTO";

export const listTemplatesController: HttpHandler = async (request) => {
  const query: ListTemplatesQuery = {
    accountId: request.query.accountId,
    context: request.query.context,
    language: request.query.language,
    page: request.query.page ? parseInt(request.query.page, 10) : undefined,
    limit: request.query.limit ? parseInt(request.query.limit, 10) : undefined,
  };
  const useCase = createListTemplatesUseCase();
  const output = await useCase.run(query);
  return {
    status: 200,
    data: output,
  };
};
