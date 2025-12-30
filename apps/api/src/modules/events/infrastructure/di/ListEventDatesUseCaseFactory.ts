import { ListEventDatesUseCase } from "../../application/use-cases/ListEventDatesUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createListEventDatesUseCase(): ListEventDatesUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new ListEventDatesUseCase(eventRepository);
}

