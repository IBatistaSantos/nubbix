import { CreateEventUseCase } from "../../application/use-cases/CreateEventUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createCreateEventUseCase(): CreateEventUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new CreateEventUseCase(eventRepository);
}
