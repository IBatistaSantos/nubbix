import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createUpdateEventUseCase } from "../../infrastructure/di/UpdateEventUseCaseFactory";
import { UpdateEventInput } from "../../application/dtos/UpdateEventDTO";

export const updateEventController: HttpHandler = async (request) => {
  const eventId = request.params.id;
  const body = request.body as Omit<UpdateEventInput, "eventId">;

  const input: UpdateEventInput = {
    ...body,
    eventId,
  };

  const useCase = createUpdateEventUseCase();
  const output = await useCase.run(input);

  return {
    status: 200,
    data: output,
  };
};
