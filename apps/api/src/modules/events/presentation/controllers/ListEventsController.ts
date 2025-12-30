import {
  HttpHandler,
  HttpRequest,
} from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createListEventsUseCase } from "../../infrastructure/di/ListEventsUseCaseFactory";
import { ListEventsQuery } from "../../application/dtos/ListEventsDTO";
import { getAuthContext } from "../../../../infrastructure/http/middleware/authMiddleware";
import { Context } from "hono";

export const listEventsController: HttpHandler = async (request) => {
  const c = (request as HttpRequest & { context: Context }).context;
  const authContext = getAuthContext(c);
  
  const query: ListEventsQuery = {
    accountId: authContext.accountId,
    tags: request.query.tags ? (request.query.tags as string).split(",") : undefined,
    type: request.query.type as any,
    ticketSalesEnabled: request.query.ticketSalesEnabled
      ? request.query.ticketSalesEnabled === "true"
      : undefined,
    ticketSalesStatus: request.query.ticketSalesStatus as any,
    page: request.query.page ? Number(request.query.page) : undefined,
    limit: request.query.limit ? Number(request.query.limit) : undefined,
  };

  const useCase = createListEventsUseCase();
  const output = await useCase.run(query);

  return {
    status: 200,
    data: output,
  };
};

