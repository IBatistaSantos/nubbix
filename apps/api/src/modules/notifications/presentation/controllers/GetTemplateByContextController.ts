import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createGetTemplateByContextUseCase } from "../../infrastructure/di/TemplateUseCaseFactory";
import { GetTemplateByContextInput } from "../../application/dtos/GetTemplateByContextDTO";

export const getTemplateByContextController: HttpHandler = async (request) => {
  const input: GetTemplateByContextInput = {
    context: request.query.context as string,
    language: request.query.language as string,
    accountId: request.query.accountId ? (request.query.accountId as string) : undefined,
  };
  const useCase = createGetTemplateByContextUseCase();
  const output = await useCase.run(input);
  return {
    status: 200,
    data: output,
  };
};
