import type { HttpClient } from "../../../../shared/http/HttpClient";
import {
  DuplicateEventInput,
  DuplicateEventOutput,
  duplicateEventInputSchema,
} from "../dtos/DuplicateEventDTO";

export class DuplicateEventUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(input: DuplicateEventInput): Promise<DuplicateEventOutput> {
    const validatedInput = duplicateEventInputSchema.parse(input);
    const { eventId, ...body } = validatedInput;

    return await this.httpClient.post<DuplicateEventOutput>(`/events/${eventId}/duplicate`, {
      body,
    });
  }
}
