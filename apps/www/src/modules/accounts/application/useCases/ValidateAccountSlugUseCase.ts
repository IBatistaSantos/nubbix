import type { HttpClient } from "../../../../shared/http/HttpClient";

export interface ValidateAccountSlugResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  accountType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export class ValidateAccountSlugUseCase {
  constructor(private readonly httpClient: HttpClient) {}

  async run(slug: string): Promise<ValidateAccountSlugResponse | null> {
    try {
      return await this.httpClient.get<ValidateAccountSlugResponse>(
        `/accounts/validate-slug?slug=${encodeURIComponent(slug)}`
      );
    } catch {
      return null;
    }
  }
}
