import type { HttpClient } from "../../../../shared/http/HttpClient";

export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  eventTypes: number;
  eventsThisMonth: number;
  nextEvent: {
    id: string;
    name: string;
    date: string;
    daysUntil: number;
  } | null;
}

export class GetEventStatsUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(): Promise<EventStats> {
    return await this.httpClient.get<EventStats>("/events/stats");
  }
}
