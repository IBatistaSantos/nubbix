import {
  HttpHandler,
  HttpRequest,
} from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createGetCurrentUserUseCase } from "../../infrastructure/di/AuthUseCaseFactory";
import { getAuthContext } from "../../../../infrastructure/http/middleware/authMiddleware";
import { Context } from "hono";

export const getCurrentUserController: HttpHandler = async (request) => {
  const c = (request as HttpRequest & { context: Context }).context;
  const authContext = getAuthContext(c);
  const useCase = createGetCurrentUserUseCase();
  const output = await useCase.run(authContext.userId);

  return {
    status: 200,
    data: output,
  };
};
