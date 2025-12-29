import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

let _db: PostgresJsDatabase<any> | null = null;

function getDatabase(): PostgresJsDatabase<any> {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const client = postgres(databaseUrl);
    _db = drizzle(client);
  }

  return _db;
}

export const db = new Proxy({} as PostgresJsDatabase<any>, {
  get(_target, prop) {
    const database = getDatabase();
    const value = database[prop as keyof PostgresJsDatabase<any>];
    if (typeof value === "function") {
      return value.bind(database);
    }
    return value;
  },
});
