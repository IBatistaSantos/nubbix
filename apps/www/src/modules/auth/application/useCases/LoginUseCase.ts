import { LoginInput, LoginOutput, loginSchema } from "../dtos";
import type { HttpClient } from "../../../../shared/http/HttpClient";

export class LoginUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(input: LoginInput, accountSlug: string): Promise<LoginOutput> {
    const validatedInput = loginSchema.parse(input);

    const user = await this.httpClient.post<LoginOutput>("/auth/login", {
      body: {
        ...validatedInput,
        accountSlug,
      },
    });

    if (user.accessToken) {
      await this.httpClient.setAuthToken(user.accessToken);
    }

    return user;
  }
}
