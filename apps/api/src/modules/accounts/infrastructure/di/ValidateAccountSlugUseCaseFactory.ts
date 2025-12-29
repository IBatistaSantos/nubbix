import { ValidateAccountSlugUseCase } from "../../application/use-cases/ValidateAccountSlugUseCase";
import { DrizzleAccountRepository } from "../repositories/DrizzleAccountRepository";

let accountRepository: DrizzleAccountRepository | null = null;

export function createValidateAccountSlugUseCase(): ValidateAccountSlugUseCase {
  if (!accountRepository) {
    accountRepository = new DrizzleAccountRepository();
  }

  return new ValidateAccountSlugUseCase(accountRepository);
}
