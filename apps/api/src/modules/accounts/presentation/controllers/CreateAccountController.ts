import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createCreateAccountUseCase } from "../../infrastructure/di/CreateAccountUseCaseFactory";
import { CreateAccountInput } from "../../application/dtos/CreateAccountDTO";

export const createAccountController: HttpHandler = async (request) => {
  const input = request.body as CreateAccountInput;
  const useCase = createCreateAccountUseCase();
  const output = await useCase.run(input);
  return {
    status: 201,
    data: output,
  };
};
