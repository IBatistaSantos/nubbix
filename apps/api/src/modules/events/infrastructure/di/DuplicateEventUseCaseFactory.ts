import { DuplicateEventUseCase } from "../../application/use-cases/DuplicateEventUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createDuplicateEventUseCase(): DuplicateEventUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new DuplicateEventUseCase(eventRepository);
}
