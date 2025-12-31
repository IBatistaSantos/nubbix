import { ResetPasswordInput, ResetPasswordOutput, resetPasswordSchema } from "../dtos";
import type { HttpClient } from "../../../../shared/http/HttpClient";

export class ResetPasswordUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(input: ResetPasswordInput, accountSlug: string): Promise<ResetPasswordOutput> {
    const validatedInput = resetPasswordSchema.parse(input);

    return await this.httpClient.post<ResetPasswordOutput>("/auth/reset-password", {
      body: {
        token: validatedInput.token,
        password: validatedInput.password,
        accountSlug,
      },
    });
  }
}
