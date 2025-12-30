import { UpdateEventDatesUseCase } from "../../application/use-cases/UpdateEventDatesUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createUpdateEventDatesUseCase(): UpdateEventDatesUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new UpdateEventDatesUseCase(eventRepository);
}

