import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createCreateTemplateUseCase } from "../../infrastructure/di/TemplateUseCaseFactory";
import { CreateTemplateInput } from "../../application/dtos/CreateTemplateDTO";

export const createTemplateController: HttpHandler = async (request) => {
  const input = request.body as CreateTemplateInput;
  const useCase = createCreateTemplateUseCase();
  const output = await useCase.run(input);
  return {
    status: 201,
    data: output,
  };
};
