import { GetEventStatsUseCase } from "../../application/use-cases/GetEventStatsUseCase";
import { DrizzleEventRepository } from "../repositories/DrizzleEventRepository";

let eventRepository: DrizzleEventRepository | null = null;

export function createGetEventStatsUseCase(): GetEventStatsUseCase {
  if (!eventRepository) {
    eventRepository = new DrizzleEventRepository();
  }

  return new GetEventStatsUseCase(eventRepository);
}
