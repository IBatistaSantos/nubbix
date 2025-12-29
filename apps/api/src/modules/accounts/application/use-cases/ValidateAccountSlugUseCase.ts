import { BaseUseCase, createZodValidator } from "@nubbix/domain";
import { AccountRepository, Slug, Account } from "../../domain";
import { ValidationError } from "@nubbix/domain";
import { z } from "zod";

const validateAccountSlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export interface ValidateAccountSlugInput {
  slug: string;
}

export type ValidateAccountSlugOutput = ReturnType<Account["toJSON"]> | null;

export class ValidateAccountSlugUseCase extends BaseUseCase<
  ValidateAccountSlugInput,
  ValidateAccountSlugOutput
> {
  constructor(private accountRepository: AccountRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<ValidateAccountSlugInput>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(validateAccountSlugSchema);
  }

  protected async execute(input: ValidateAccountSlugInput): Promise<ValidateAccountSlugOutput> {
    try {
      const slug = Slug.create(input.slug);
      const account = await this.accountRepository.findBySlug(slug);

      if (!account) {
        return null;
      }

      return account.toJSON();
    } catch (error) {
      if (error instanceof ValidationError) {
        return null;
      }
      throw error;
    }
  }
}
