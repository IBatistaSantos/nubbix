import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createLoginUseCase } from "../../infrastructure/di/AuthUseCaseFactory";
import { LoginInput } from "../../application/dtos/LoginDTO";

export const loginController: HttpHandler = async (request) => {
  const input = request.body as LoginInput;
  const useCase = createLoginUseCase();
  const output = await useCase.run(input);
  return {
    status: 200,
    data: output,
  };
};

