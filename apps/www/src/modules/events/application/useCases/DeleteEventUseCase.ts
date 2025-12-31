import type { HttpClient } from "../../../../shared/http/HttpClient";

export class DeleteEventUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(eventId: string): Promise<void> {
    await this.httpClient.delete<void>(`/events/${eventId}`);
  }
}
