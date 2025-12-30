import { GetEventUseCase } from "../../application/use-cases/GetEventUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createGetEventUseCase(): GetEventUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new GetEventUseCase(eventRepository);
}

