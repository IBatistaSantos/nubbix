import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createDeleteTemplateUseCase } from "../../infrastructure/di/TemplateUseCaseFactory";

export const deleteTemplateController: HttpHandler = async (request) => {
  const templateId = request.params.id;
  const useCase = createDeleteTemplateUseCase();
  await useCase.run(templateId);
  return {
    status: 204,
    data: null,
  };
};
