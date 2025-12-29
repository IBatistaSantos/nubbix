import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/ResetPasswordUseCase";
import { DrizzleUserRepository } from "../repositories/DrizzleUserRepository";
import { HonoJwtService } from "../services/HonoJwtService";
import { BunPasswordHasher } from "../../../accounts/infrastructure/services/BunPasswordHasher";
import { DrizzleTransactionManager } from "../../../../shared/infrastructure/transactions";
import { db } from "../../../../shared/infrastructure/db";
import { createSendNotificationUseCase } from "../../../notifications/infrastructure/di/SendNotificationUseCaseFactory";

let userRepository: DrizzleUserRepository | null = null;
let jwtService: HonoJwtService | null = null;
let passwordHasher: BunPasswordHasher | null = null;
let transactionManager: DrizzleTransactionManager | null = null;

export function createLoginUseCase(): LoginUseCase {
  if (!userRepository) {
    userRepository = new DrizzleUserRepository();
  }

  if (!jwtService) {
    jwtService = new HonoJwtService();
  }

  if (!passwordHasher) {
    passwordHasher = new BunPasswordHasher();
  }

  return new LoginUseCase(userRepository, passwordHasher, jwtService);
}

export function createForgotPasswordUseCase(): ForgotPasswordUseCase {
  if (!userRepository) {
    userRepository = new DrizzleUserRepository();
  }

  if (!transactionManager) {
    transactionManager = new DrizzleTransactionManager(db);
  }

  const sendNotificationUseCase = createSendNotificationUseCase();

  return new ForgotPasswordUseCase(
    userRepository,
    transactionManager,
    sendNotificationUseCase
  );
}

export function createResetPasswordUseCase(): ResetPasswordUseCase {
  if (!userRepository) {
    userRepository = new DrizzleUserRepository();
  }

  if (!passwordHasher) {
    passwordHasher = new BunPasswordHasher();
  }

  if (!transactionManager) {
    transactionManager = new DrizzleTransactionManager(db);
  }

  return new ResetPasswordUseCase(
    userRepository,
    passwordHasher,
    transactionManager
  );
}

