import { BaseUseCase, createZodValidator, ValidationError, ID } from "@nubbix/domain";
import { Event, EventRepository, EventUrl, EventDate } from "../../domain";
import {
  DuplicateEventInput,
  DuplicateEventOutput,
  duplicateEventSchema,
} from "../dtos/DuplicateEventDTO";
import { ConflictError, BadRequestError, NotFoundError } from "../../../../shared/errors";

export class DuplicateEventUseCase extends BaseUseCase<DuplicateEventInput, DuplicateEventOutput> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<DuplicateEventInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(duplicateEventSchema);
  }

  protected async execute(input: DuplicateEventInput): Promise<DuplicateEventOutput> {
    const eventId = ID.create(input.eventId);
    const originalEvent = await this.eventRepository.findById(eventId);

    if (!originalEvent) {
      throw new NotFoundError("Event not found");
    }

    const eventUrl = EventUrl.create(input.url);
    const exists = await this.eventRepository.existsByUrl(originalEvent.accountId, eventUrl);

    if (exists) {
      throw new ConflictError("Event with this URL already exists in this account");
    }

    try {
      EventDate.validateDates(input.dates.map((d) => d.date));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestError("Cannot create event with dates in the past");
      }
      throw error;
    }

    const newEvent = new Event({
      accountId: originalEvent.accountId,
      name: input.name,
      description: originalEvent.description,
      type: originalEvent.type,
      url: input.url,
      address: originalEvent.address,
      maxCapacity: originalEvent.maxCapacity,
      ticketSales: originalEvent.ticketSales,
      tags: originalEvent.tags,
      dates: input.dates.map((date) =>
        EventDate.create({
          date: date.date,
          startTime: date.startTime,
          endTime: date.endTime,
          finished: false,
          finishedAt: null,
        })
      ),
    });

    newEvent.validate();

    await this.eventRepository.save(newEvent);

    return newEvent.toJSON();
  }
}
