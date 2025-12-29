import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { EventRepository, EventType, Address, TicketSales } from "../../domain";
import { UpdateEventInput, UpdateEventOutput, updateEventSchema } from "../dtos/UpdateEventDTO";
import { NotFoundError } from "../../../../shared/errors";

export class UpdateEventUseCase extends BaseUseCase<UpdateEventInput, UpdateEventOutput> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<UpdateEventInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(updateEventSchema);
  }

  protected async execute(input: UpdateEventInput): Promise<UpdateEventOutput> {
    const eventId = ID.create(input.eventId);
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const updateData: {
      name?: string;
      description?: string;
      type?: EventType;
      address?: Address | null;
      maxCapacity?: number | null;
      ticketSales?: TicketSales;
      tags?: string[];
    } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.type !== undefined) {
      updateData.type = EventType.fromValue(input.type);
    }

    if (input.address !== undefined) {
      updateData.address = input.address ? Address.create(input.address) : null;
    }

    if (input.maxCapacity !== undefined) {
      updateData.maxCapacity = input.maxCapacity;
    }

    if (input.ticketSales !== undefined) {
      updateData.ticketSales = TicketSales.create(input.ticketSales);
    }

    if (input.tags !== undefined) {
      updateData.tags = input.tags;
    }

    event.update(updateData);
    await this.eventRepository.save(event);

    return event.toJSON() as UpdateEventOutput;
  }
}
