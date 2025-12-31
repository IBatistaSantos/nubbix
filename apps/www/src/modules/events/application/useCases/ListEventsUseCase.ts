import type { HttpClient } from "../../../../shared/http/HttpClient";
import type { Event } from "../../presentation/queries/eventQueries";

export interface ListEventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListEventsUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(): Promise<Event[]> {
    const response = await this.httpClient.get<ListEventsResponse>("/events");
    return response.events;
  }
}
