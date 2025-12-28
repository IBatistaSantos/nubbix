import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createUpdateTemplateUseCase } from "../../infrastructure/di/TemplateUseCaseFactory";
import { UpdateTemplateInput } from "../../application/dtos/UpdateTemplateDTO";

export const updateTemplateController: HttpHandler = async (request) => {
  const templateId = request.params.id;
  const body = request.body as Omit<UpdateTemplateInput, "templateId">;
  const input: UpdateTemplateInput = {
    ...body,
    templateId,
  };
  const useCase = createUpdateTemplateUseCase();
  const output = await useCase.run(input);
  return {
    status: 200,
    data: output,
  };
};
