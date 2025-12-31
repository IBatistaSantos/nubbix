import type { HttpClient } from "../../../../shared/http/HttpClient";
import type { User } from "../../domain/types/AuthTypes";

export class GetUserProfileUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(): Promise<User | null> {
    try {
      return await this.httpClient.get<User>("/auth/me");
    } catch {
      return null;
    }
  }
}
