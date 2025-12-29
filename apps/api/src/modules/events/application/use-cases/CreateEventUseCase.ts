import { BaseUseCase, createZodValidator } from "@nubbix/domain";
import {
  Event,
  EventRepository,
  EventType,
  EventUrl,
  Address,
  TicketSales,
  EventDate,
} from "../../domain";
import { CreateEventInput, CreateEventOutput, createEventSchema } from "../dtos/CreateEventDTO";
import { ConflictError } from "../../../../shared/errors";

export class CreateEventUseCase extends BaseUseCase<CreateEventInput, CreateEventOutput> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<CreateEventInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(createEventSchema);
  }

  protected async execute(input: CreateEventInput): Promise<CreateEventOutput> {
    const eventUrl = EventUrl.create(input.url);
    const exists = await this.eventRepository.existsByUrl(input.accountId, eventUrl);

    if (exists) {
      throw new ConflictError("Event with this URL already exists in this account");
    }

    const event = new Event({
      accountId: input.accountId,
      name: input.name,
      description: input.description,
      type: EventType.fromValue(input.type),
      url: input.url,
      address: input.address ? Address.create(input.address) : null,
      maxCapacity: input.maxCapacity ?? null,
      ticketSales: TicketSales.create(input.ticketSales),
      tags: input.tags ?? [],
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

    event.validate();

    await this.eventRepository.save(event);

    return event.toJSON();
  }
}
