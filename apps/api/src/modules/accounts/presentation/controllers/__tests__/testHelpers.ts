import { CreateAccountUseCase } from "../../../application/use-cases/CreateAccountUseCase";
import { DrizzleAccountRepository } from "../../../infrastructure/repositories/DrizzleAccountRepository";
import { DrizzleUserRepository } from "../../../../identity/infrastructure/repositories/DrizzleUserRepository";
import { BunPasswordHasher } from "../../../infrastructure/services/BunPasswordHasher";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export function createTestUseCase(db: PostgresJsDatabase<any>): CreateAccountUseCase {
  return new CreateAccountUseCase(
    new DrizzleAccountRepository(db),
    new DrizzleUserRepository(db),
    new BunPasswordHasher()
  );
}
