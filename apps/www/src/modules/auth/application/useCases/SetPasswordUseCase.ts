import { SetPasswordInput, SetPasswordOutput, setPasswordSchema } from "../dtos";
import type { HttpClient } from "../../../../shared/http/HttpClient";

export class SetPasswordUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(input: SetPasswordInput): Promise<SetPasswordOutput> {
    const validatedInput = setPasswordSchema.parse(input);

    return await this.httpClient.post<SetPasswordOutput>("/accounts/set-password", {
      body: {
        token: validatedInput.token,
        password: validatedInput.password,
      },
    });
  }
}
