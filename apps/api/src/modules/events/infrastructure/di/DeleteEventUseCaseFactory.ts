import { DeleteEventUseCase } from "../../application/use-cases/DeleteEventUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createDeleteEventUseCase(): DeleteEventUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new DeleteEventUseCase(eventRepository);
}

