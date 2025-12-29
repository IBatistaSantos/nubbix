import { SetPasswordUseCase } from "../../application/use-cases/SetPasswordUseCase";
import { DrizzleUserRepository } from "../../../identity/infrastructure/repositories/DrizzleUserRepository";
import { BunPasswordHasher } from "../services/BunPasswordHasher";
import { DrizzleTransactionManager } from "../../../../shared/infrastructure/transactions";
import { db } from "../../../../shared/infrastructure/db";

let userRepository: DrizzleUserRepository | null = null;
let passwordHasher: BunPasswordHasher | null = null;
let transactionManager: DrizzleTransactionManager | null = null;

export function createSetPasswordUseCase(): SetPasswordUseCase {
  if (!userRepository) {
    userRepository = new DrizzleUserRepository();
  }

  if (!passwordHasher) {
    passwordHasher = new BunPasswordHasher();
  }

  if (!transactionManager) {
    transactionManager = new DrizzleTransactionManager(db);
  }

  return new SetPasswordUseCase(userRepository, passwordHasher, transactionManager);
}
