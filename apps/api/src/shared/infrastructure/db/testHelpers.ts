import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

export interface TestDatabase {
  db: PostgresJsDatabase<any>;
  client: ReturnType<typeof postgres>;
  close: () => Promise<void>;
  cleanup: () => Promise<void>;
}

export function createTestDatabase(): TestDatabase {
  const databaseUrl = process.env.DATABASE_TEST_URL;

  if (!databaseUrl) {
    const error = new Error(
      "DATABASE_TEST_URL or DATABASE_URL environment variable is not set.\n" +
        "Please configure a test database to run integration tests.\n" +
        "Example: DATABASE_TEST_URL=postgresql://postgres:postgres@localhost:5432/app_test\n" +
        "Or create a .env file with DATABASE_TEST_URL or DATABASE_URL"
    );
    (error as any).skipTest = true;
    throw error;
  }

  const client = postgres(databaseUrl, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  const db = drizzle(client);

  return {
    db,
    client,
    close: async () => {
      await client.end();
    },
    cleanup: async () => {
      await db.execute(sql`TRUNCATE TABLE accounts, users RESTART IDENTITY CASCADE`);
    },
  };
}

export async function withTransaction<T>(
  db: PostgresJsDatabase<any>,
  callback: (tx: PostgresJsDatabase<any>) => Promise<T>
): Promise<T> {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
}
