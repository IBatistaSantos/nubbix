import type { HttpClient } from "../../../../shared/http/HttpClient";

export class LogoutUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(): Promise<void> {
    await this.httpClient.clearAuthToken();
  }
}
