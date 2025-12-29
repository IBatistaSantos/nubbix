import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { getTestDatabase } from "../database";

export interface UseCaseTesterConfig<TInput, TOutput> {
  useCaseFactory: (db: PostgresJsDatabase<any>) => any;
  execute: (useCase: any, input: TInput) => Promise<TOutput>;
}

export class UseCaseTester<TInput, TOutput> {
  private db: PostgresJsDatabase<any> | null = null;
  private useCase: any = null;
  private initialized = false;

  constructor(private config: UseCaseTesterConfig<TInput, TOutput>) {}

  private ensureInitialized() {
    if (!this.initialized) {
      this.db = getTestDatabase();
      if (!this.db) {
        throw new Error("Database not available");
      }
      this.useCase = this.config.useCaseFactory(this.db);
      this.initialized = true;
    }
  }

  async run(input: TInput): Promise<TOutput> {
    this.ensureInitialized();
    return this.config.execute(this.useCase, input);
  }

  getDatabase(): PostgresJsDatabase<any> {
    this.ensureInitialized();
    return this.db!;
  }
}
