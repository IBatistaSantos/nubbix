import { beforeAll, beforeEach, afterEach, afterAll } from "bun:test";
import {
  startTestDatabase,
  stopTestDatabase,
  cleanupTestDatabase,
  getTestDatabase,
} from "./database";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

export interface TestContext {
  db: PostgresJsDatabase<any>;
}

let canRunTests = false;

async function createDefaultTemplate(): Promise<void> {
  const db = getTestDatabase();
  if (!db) return;

  try {
    const templateId = crypto.randomUUID();
    await db.execute(sql`
      INSERT INTO templates (id, channel, subject, body, context, language, account_id, is_default, status, created_at, updated_at)
      VALUES (
        ${templateId},
        'email',
        'Welcome {{name}}',
        'Click here to set your password: {{url}}',
        'account.welcome',
        'pt-BR',
        NULL,
        true,
        'active',
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING
    `);
  } catch (error: any) {
    // Ignore errors - template might already exist
  }
}

export function setupIntegrationTests(): TestContext | null {
  beforeAll(async () => {
    try {
      await startTestDatabase();
      canRunTests = true;
      await createDefaultTemplate();
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.warn(`⚠️  Skipping integration tests: ${errorMessage.substring(0, 200)}`);
      canRunTests = false;
    }
  }, 30000);

  beforeEach(async () => {
    if (canRunTests) {
      await cleanupTestDatabase();
      await createDefaultTemplate();
    }
  });

  afterAll(async () => {
    if (canRunTests) {
      await stopTestDatabase();
    }
  });

  return { db: getTestDatabase()! };
}
