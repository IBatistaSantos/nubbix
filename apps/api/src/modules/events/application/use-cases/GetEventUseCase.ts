import { BaseUseCase, ID, InputValidator } from "@nubbix/domain";
import { EventRepository } from "../../domain";
import { GetEventOutput } from "../dtos/GetEventDTO";
import { NotFoundError } from "../../../../shared/errors";
import { sortEventDates } from "../utils/sortEventDates";

export class GetEventUseCase extends BaseUseCase<string, GetEventOutput> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): InputValidator<string> {
    return {
      validate(input: unknown): string {
        if (typeof input !== "string") {
          throw new Error("Input must be a string");
        }
        return input;
      },
    };
  }

  protected async execute(eventId: string): Promise<GetEventOutput> {
    const id = ID.create(eventId);
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const sortedDates = sortEventDates(event.dates);
    const json = event.toJSON();

    return {
      ...json,
      dates: sortedDates.map((date) => date.toJSON()),
    } as GetEventOutput;
  }
}
