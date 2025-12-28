import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { sql } from "drizzle-orm";

let db: PostgresJsDatabase<any> | null = null;
let client: ReturnType<typeof postgres> | null = null;

const getConnectionString = (): string => {
  const host = process.env.DATABASE_TEST_HOST || "localhost";
  const port = process.env.DATABASE_TEST_PORT || "5432";
  const user = process.env.DATABASE_TEST_USER || "postgres";
  const password = process.env.DATABASE_TEST_PASSWORD || "postgres";
  const database = "tests";

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

async function runMigrations(database: PostgresJsDatabase<any>): Promise<void> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const apiDir = join(currentDir, "../..");
  const migrationsDir = join(apiDir, "drizzle");
  const files = await readdir(migrationsDir);
  const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

  for (const file of sqlFiles) {
    const migrationSQL = await readFile(join(migrationsDir, file), "utf-8");
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"));

    for (const statement of statements) {
      if (!statement) continue;

      const isCreateType = statement.toUpperCase().includes("CREATE TYPE");
      const isCreateTable = statement.toUpperCase().includes("CREATE TABLE");
      const isCreateConstraint = statement.toUpperCase().includes("CONSTRAINT");

      try {
        await database.execute(sql.raw(statement));
      } catch (error: any) {
        if (isCreateType || isCreateTable || isCreateConstraint) {
          continue;
        }

        const errorCode = error?.code || "";
        const errorMessage = (error?.message || String(error) || "").toLowerCase();
        const errorString = String(error).toLowerCase();
        const fullError = `${errorMessage} ${errorString}`;

        const shouldIgnore =
          errorCode === "42P07" ||
          errorCode === "42710" ||
          fullError.includes("already exists") ||
          fullError.includes("duplicate");

        if (!shouldIgnore) {
          throw error;
        }
      }
    }
  }
}

async function ensureDatabaseExists(): Promise<void> {
  const host = process.env.DATABASE_TEST_HOST || "localhost";
  const port = process.env.DATABASE_TEST_PORT || "5432";
  const user = process.env.DATABASE_TEST_USER || "postgres";
  const password = process.env.DATABASE_TEST_PASSWORD || "postgres";
  const database = "tests";

  const adminConnectionString = `postgresql://${user}:${password}@${host}:${port}/postgres`;
  const adminClient = postgres(adminConnectionString, { max: 1 });

  try {
    const result = await adminClient`SELECT 1 FROM pg_database WHERE datname = ${database}`;
    if (result.length === 0) {
      await adminClient.unsafe(`CREATE DATABASE ${database}`);
    }
  } finally {
    await adminClient.end();
  }
}

export async function startTestDatabase(): Promise<PostgresJsDatabase<any>> {
  if (db) {
    return db;
  }

  await ensureDatabaseExists();

  const connectionString = getConnectionString();
  client = postgres(connectionString, { max: 1 });
  db = drizzle(client);

  await runMigrations(db);
  return db;
}

export async function stopTestDatabase(): Promise<void> {
  if (client) {
    await client.end();
    client = null;
  }
  db = null;
}

export async function cleanupTestDatabase(): Promise<void> {
  if (db) {
    await db.execute(sql`TRUNCATE TABLE accounts, users, templates RESTART IDENTITY CASCADE`);
  }
}

export function getTestDatabase(): PostgresJsDatabase<any> | null {
  return db;
}
