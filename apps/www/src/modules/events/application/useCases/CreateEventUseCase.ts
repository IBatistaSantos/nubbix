import { CreateEventInput, CreateEventOutput, createEventSchema } from "../dtos/CreateEventDTO";
import type { HttpClient } from "../../../../shared/http/HttpClient";

export class CreateEventUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(input: CreateEventInput): Promise<CreateEventOutput> {
    const validatedInput = createEventSchema.parse(input);

    return await this.httpClient.post<CreateEventOutput>("/events", {
      body: validatedInput,
    });
  }
}
