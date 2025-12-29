import { BaseUseCase, createZodValidator, ID } from "@nubbix/domain";
import { EventRepository } from "../../domain";
import {
  UpdateEventDatesInput,
  UpdateEventDatesOutput,
  updateEventDatesSchema,
} from "../dtos/UpdateEventDatesDTO";
import { NotFoundError } from "../../../../shared/errors";
import { sortEventDates } from "../utils/sortEventDates";

export class UpdateEventDatesUseCase extends BaseUseCase<
  UpdateEventDatesInput,
  UpdateEventDatesOutput
> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<UpdateEventDatesInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(updateEventDatesSchema);
  }

  protected async execute(input: UpdateEventDatesInput): Promise<UpdateEventDatesOutput> {
    const eventId = ID.create(input.eventId);
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    if (input.add) {
      for (const date of input.add) {
        event.addDate({
          date: date.date,
          startTime: date.startTime,
          endTime: date.endTime,
          finished: false,
          finishedAt: null,
        });
      }
    }

    if (input.update) {
      for (const update of input.update) {
        event.updateDate(update.dateId, {
          date: update.date,
          startTime: update.startTime,
          endTime: update.endTime,
        });
      }
    }

    if (input.remove) {
      for (const dateId of input.remove) {
        event.removeDate(dateId);
      }
    }

    const datesArray = event.dates;
    const sortedDates = sortEventDates(datesArray);
    datesArray.length = 0;
    datesArray.push(...sortedDates);

    await this.eventRepository.save(event);

    const json = event.toJSON();
    return {
      ...json,
      dates: sortedDates.map((date) => date.toJSON()),
    } as UpdateEventDatesOutput;
  }
}
