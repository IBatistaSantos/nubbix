import {
  HttpHandler,
  HttpRequest,
} from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createCreateEventUseCase } from "../../infrastructure/di/CreateEventUseCaseFactory";
import { CreateEventInput } from "../../application/dtos/CreateEventDTO";
import { getAuthContext } from "../../../../infrastructure/http/middleware/authMiddleware";
import { Context } from "hono";

export const createEventController: HttpHandler = async (request) => {
  const c = (request as HttpRequest & { context: Context }).context;
  const authContext = getAuthContext(c);
  const body = request.body as Omit<CreateEventInput, "accountId">;

  const input: CreateEventInput = {
    ...body,
    accountId: authContext.accountId,
  };

  const useCase = createCreateEventUseCase();
  const output = await useCase.run(input);

  return {
    status: 201,
    data: output,
  };
};
