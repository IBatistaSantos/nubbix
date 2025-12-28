import { CreateAccountUseCase } from "../../application/use-cases/CreateAccountUseCase";
import { DrizzleAccountRepository } from "../repositories/DrizzleAccountRepository";
import { DrizzleUserRepository } from "../../../identity/infrastructure/repositories/DrizzleUserRepository";
import { BunPasswordHasher } from "../services/BunPasswordHasher";

let accountRepository: DrizzleAccountRepository | null = null;
let userRepository: DrizzleUserRepository | null = null;
let passwordHasher: BunPasswordHasher | null = null;

export function createCreateAccountUseCase(): CreateAccountUseCase {
  if (!accountRepository) {
    accountRepository = new DrizzleAccountRepository();
  }

  if (!userRepository) {
    userRepository = new DrizzleUserRepository();
  }

  if (!passwordHasher) {
    passwordHasher = new BunPasswordHasher();
  }

  return new CreateAccountUseCase(accountRepository, userRepository, passwordHasher);
}
