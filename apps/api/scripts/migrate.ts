#!/usr/bin/env bun

import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { join } from "path";
import { fileURLToPath } from "url";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const migrationsFolder = join(__dirname, "..", "drizzle");

console.log("🔄 Starting database migration...");
console.log(`📁 Migrations folder: ${migrationsFolder}`);

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client);

try {
  await migrate(db, { migrationsFolder });
  console.log("✅ Migrations applied successfully!");
  process.exit(0);
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
} finally {
  await client.end();
}
