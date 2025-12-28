import { TransactionManager, TransactionContext } from "@nubbix/domain";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class DrizzleTransactionManager implements TransactionManager {
  constructor(private readonly db: PostgresJsDatabase<any>) {}

  async runInTransaction<T>(callback: (tx: TransactionContext) => Promise<T>): Promise<T> {
    return await this.db.transaction(async (tx) => {
      return await callback(tx as TransactionContext);
    });
  }
}
