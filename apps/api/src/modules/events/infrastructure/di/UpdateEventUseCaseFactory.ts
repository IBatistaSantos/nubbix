import { UpdateEventUseCase } from "../../application/use-cases/UpdateEventUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createUpdateEventUseCase(): UpdateEventUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new UpdateEventUseCase(eventRepository);
}
