import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createListEventDatesUseCase } from "../../infrastructure/di/ListEventDatesUseCaseFactory";

export const listEventDatesController: HttpHandler = async (request) => {
  const eventId = request.params.id;

  const useCase = createListEventDatesUseCase();
  const output = await useCase.run(eventId);

  return {
    status: 200,
    data: output,
  };
};
