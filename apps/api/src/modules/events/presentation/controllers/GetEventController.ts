import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createGetEventUseCase } from "../../infrastructure/di/GetEventUseCaseFactory";

export const getEventController: HttpHandler = async (request) => {
  const eventId = request.params.id;

  const useCase = createGetEventUseCase();
  const output = await useCase.run(eventId);

  return {
    status: 200,
    data: output,
  };
};

