import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createGetTemplateUseCase } from "../../infrastructure/di/TemplateUseCaseFactory";

export const getTemplateController: HttpHandler = async (request) => {
  const templateId = request.params.id;
  const useCase = createGetTemplateUseCase();
  const output = await useCase.run(templateId);
  return {
    status: 200,
    data: output,
  };
};
