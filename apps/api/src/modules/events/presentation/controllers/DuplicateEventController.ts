import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { createDuplicateEventUseCase } from "../../infrastructure/di/DuplicateEventUseCaseFactory";
import { DuplicateEventInput } from "../../application/dtos/DuplicateEventDTO";

export const duplicateEventController: HttpHandler = async (request) => {
  const eventId = request.params.id;
  const body = request.body as Omit<DuplicateEventInput, "eventId">;

  const input: DuplicateEventInput = {
    ...body,
    eventId,
  };

  const useCase = createDuplicateEventUseCase();
  const output = await useCase.run(input);

  return {
    status: 201,
    data: output,
  };
};
