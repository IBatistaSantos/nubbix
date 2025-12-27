#!/usr/bin/env bun

import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { join } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { readdir } from "fs/promises";

const databaseUrl = process.env.DATABASE_URL;

console.log("=".repeat(50));
console.log("🔄 DATABASE MIGRATION SCRIPT");
console.log("=".repeat(50));

if (!databaseUrl) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not set");
  process.exit(1);
}

console.log("✅ DATABASE_URL is set");

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const migrationsFolder = join(__dirname, "..", "drizzle");

console.log(`📁 Current working directory: ${process.cwd()}`);
console.log(`📁 Script location: ${__filename}`);
console.log(`📁 Migrations folder: ${migrationsFolder}`);

if (!existsSync(migrationsFolder)) {
  console.error(`❌ ERROR: Migrations folder does not exist: ${migrationsFolder}`);
  process.exit(1);
}

console.log("✅ Migrations folder exists");

try {
  const files = await readdir(migrationsFolder);
  console.log(`📄 Found ${files.length} items in migrations folder:`);
  files.forEach((file) => console.log(`   - ${file}`));
} catch (error) {
  console.error(`❌ ERROR: Cannot read migrations folder: ${error}`);
  process.exit(1);
}

console.log("🔌 Connecting to database...");
const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client);

try {
  console.log("🚀 Running migrations...");
  await migrate(db as any, { migrationsFolder });
  console.log("=".repeat(50));
  console.log("✅ SUCCESS: Migrations applied successfully!");
  console.log("=".repeat(50));
  process.exit(0);
} catch (error) {
  console.error("=".repeat(50));
  console.error("❌ ERROR: Migration failed");
  console.error("=".repeat(50));
  console.error(error);
  if (error instanceof Error) {
    console.error(`Error message: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
  }
  process.exit(1);
} finally {
  console.log("🔌 Closing database connection...");
  await client.end();
}
