import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createUpdateEventDatesUseCase } from "../../infrastructure/di/UpdateEventDatesUseCaseFactory";
import { UpdateEventDatesInput } from "../../application/dtos/UpdateEventDatesDTO";

export const updateEventDatesController: HttpHandler = async (request) => {
  const eventId = request.params.id;
  const body = request.body as Omit<UpdateEventDatesInput, "eventId">;

  const input: UpdateEventDatesInput = {
    ...body,
    eventId,
  };

  const useCase = createUpdateEventDatesUseCase();
  const output = await useCase.run(input);

  return {
    status: 200,
    data: output,
  };
};

