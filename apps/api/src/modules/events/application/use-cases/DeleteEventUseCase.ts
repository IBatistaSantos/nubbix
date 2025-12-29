import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { z } from "zod";
import { EventRepository } from "../../domain";
import { NotFoundError } from "../../../../shared/errors";

const eventIdSchema = z.string().uuid("Invalid event ID format");

export class DeleteEventUseCase extends BaseUseCase<string, void> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<string>> {
    // @ts-ignore
    return createZodValidator(eventIdSchema);
  }

  protected async execute(eventId: string): Promise<void> {
    const id = ID.create(eventId);
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    event.deactivate();
    await this.eventRepository.save(event);
  }
}
