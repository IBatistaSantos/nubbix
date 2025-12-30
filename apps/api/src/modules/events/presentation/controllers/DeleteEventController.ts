import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createDeleteEventUseCase } from "../../infrastructure/di/DeleteEventUseCaseFactory";

export const deleteEventController: HttpHandler = async (request) => {
  const eventId = request.params.id;

  const useCase = createDeleteEventUseCase();
  await useCase.run(eventId);

  return {
    status: 204,
    data: null,
  };
};
