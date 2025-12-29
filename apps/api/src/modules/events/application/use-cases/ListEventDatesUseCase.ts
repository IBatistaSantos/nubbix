import { BaseUseCase, ID, InputValidator } from "@nubbix/domain";
import { EventRepository } from "../../domain";
import { ListEventDatesOutput } from "../dtos/ListEventDatesDTO";
import { NotFoundError } from "../../../../shared/errors";
import { sortEventDates } from "../utils/sortEventDates";

export class ListEventDatesUseCase extends BaseUseCase<string, ListEventDatesOutput> {
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

  protected async execute(eventId: string): Promise<ListEventDatesOutput> {
    const id = ID.create(eventId);
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const sortedDates = sortEventDates(event.dates);

    return {
      dates: sortedDates.map((date) => date.toJSON()),
    };
  }
}
