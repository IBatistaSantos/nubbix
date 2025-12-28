import { CreateAccountUseCase } from "../../application/use-cases/CreateAccountUseCase";
import { DrizzleAccountRepository } from "../repositories/DrizzleAccountRepository";
import { DrizzleUserRepository } from "../../../identity/infrastructure/repositories/DrizzleUserRepository";
import { BunPasswordHasher } from "../services/BunPasswordHasher";
import { DrizzleTransactionManager } from "../../../../shared/infrastructure/transactions";
import { db } from "../../../../shared/infrastructure/db";

let accountRepository: DrizzleAccountRepository | null = null;
let userRepository: DrizzleUserRepository | null = null;
let passwordHasher: BunPasswordHasher | null = null;
let transactionManager: DrizzleTransactionManager | null = null;

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

  if (!transactionManager) {
    transactionManager = new DrizzleTransactionManager(db);
  }

  return new CreateAccountUseCase(
    accountRepository,
    userRepository,
    passwordHasher,
    transactionManager
  );
}
