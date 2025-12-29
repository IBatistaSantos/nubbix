import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createResetPasswordUseCase } from "../../infrastructure/di/AuthUseCaseFactory";
import { ResetPasswordInput } from "../../application/dtos/ResetPasswordDTO";

export const resetPasswordController: HttpHandler = async (request) => {
  const input = request.body as ResetPasswordInput;
  const useCase = createResetPasswordUseCase();
  const output = await useCase.run(input);

  return {
    status: 200,
    data: output,
  };
};
