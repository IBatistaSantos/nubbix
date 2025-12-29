import { CreateAccountUseCase } from "../../application/use-cases/CreateAccountUseCase";
import { DrizzleAccountRepository } from "../repositories/DrizzleAccountRepository";
import { DrizzleUserRepository } from "../../../identity/infrastructure/repositories/DrizzleUserRepository";
import { DrizzleTransactionManager } from "../../../../shared/infrastructure/transactions";
import { db } from "../../../../shared/infrastructure/db";
import { createSendNotificationUseCase } from "../../../notifications/infrastructure/di/SendNotificationUseCaseFactory";

let accountRepository: DrizzleAccountRepository | null = null;
let userRepository: DrizzleUserRepository | null = null;
let transactionManager: DrizzleTransactionManager | null = null;

export function createCreateAccountUseCase(): CreateAccountUseCase {
  if (!accountRepository) {
    accountRepository = new DrizzleAccountRepository();
  }

  if (!userRepository) {
    userRepository = new DrizzleUserRepository();
  }

  if (!transactionManager) {
    transactionManager = new DrizzleTransactionManager(db);
  }

  const sendNotificationUseCase = createSendNotificationUseCase();

  return new CreateAccountUseCase(
    accountRepository,
    userRepository,
    transactionManager,
    sendNotificationUseCase
  );
}
