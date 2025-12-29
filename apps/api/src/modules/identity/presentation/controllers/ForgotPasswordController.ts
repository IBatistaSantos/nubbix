import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createForgotPasswordUseCase } from "../../infrastructure/di/AuthUseCaseFactory";
import { ForgotPasswordInput } from "../../application/dtos/ForgotPasswordDTO";

export const forgotPasswordController: HttpHandler = async (request) => {
  const input = request.body as ForgotPasswordInput;
  const useCase = createForgotPasswordUseCase();
  const output = await useCase.run(input);
  return {
    status: 200,
    data: output,
  };
};

