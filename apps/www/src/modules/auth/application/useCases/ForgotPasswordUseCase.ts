import { ForgotPasswordInput, ForgotPasswordOutput, forgotPasswordSchema } from "../dtos";
import type { HttpClient } from "../../../../shared/http/HttpClient";

export class ForgotPasswordUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(input: ForgotPasswordInput, accountSlug: string): Promise<ForgotPasswordOutput> {
    const validatedInput = forgotPasswordSchema.parse(input);

    return await this.httpClient.post<ForgotPasswordOutput>("/auth/forgot-password", {
      body: {
        ...validatedInput,
        accountSlug,
      },
    });
  }
}
