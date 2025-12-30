import { ListEventsUseCase } from "../../application/use-cases/ListEventsUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createListEventsUseCase(): ListEventsUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new ListEventsUseCase(eventRepository);
}

