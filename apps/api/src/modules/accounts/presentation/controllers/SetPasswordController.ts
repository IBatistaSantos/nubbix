import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createSetPasswordUseCase } from "../../infrastructure/di/SetPasswordUseCaseFactory";
import { SetPasswordInput } from "../../application/dtos/SetPasswordDTO";

export const setPasswordController: HttpHandler = async (request) => {
  const input = request.body as SetPasswordInput;
  const useCase = createSetPasswordUseCase();
  const output = await useCase.run(input);
  return {
    status: 200,
    data: output,
  };
};
