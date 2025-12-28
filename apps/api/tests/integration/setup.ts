import { beforeAll, afterEach, afterAll } from "bun:test";
import {
  startTestDatabase,
  stopTestDatabase,
  cleanupTestDatabase,
  getTestDatabase,
} from "./database";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export interface TestContext {
  db: PostgresJsDatabase<any>;
}

let canRunTests = false;

export function setupIntegrationTests(): TestContext | null {
  beforeAll(async () => {
    try {
      await startTestDatabase();
      canRunTests = true;
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.warn(`⚠️  Skipping integration tests: ${errorMessage.substring(0, 200)}`);
      canRunTests = false;
    }
  }, 30000);

  afterEach(async () => {
    if (canRunTests) {
      await cleanupTestDatabase();
    }
  });

  afterAll(async () => {
    if (canRunTests) {
      await stopTestDatabase();
    }
  });

  return { db: getTestDatabase()! };
}
