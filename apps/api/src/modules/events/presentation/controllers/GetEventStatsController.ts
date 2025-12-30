import {
  HttpHandler,
  HttpRequest,
} from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createGetEventStatsUseCase } from "../../infrastructure/di/GetEventStatsUseCaseFactory";
import { GetEventStatsQuery } from "../../application/dtos/GetEventStatsDTO";
import { getAuthContext } from "../../../../infrastructure/http/middleware/authMiddleware";
import { Context } from "hono";

export const getEventStatsController: HttpHandler = async (request) => {
  const c = (request as HttpRequest & { context: Context }).context;
  const authContext = getAuthContext(c);

  const query: GetEventStatsQuery = {
    accountId: authContext.accountId,
  };

  const useCase = createGetEventStatsUseCase();
  const output = await useCase.run(query);

  return {
    status: 200,
    data: output,
  };
};
