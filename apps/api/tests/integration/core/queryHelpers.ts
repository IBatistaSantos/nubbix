import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq, and, isNull } from "drizzle-orm";
import { getTestDatabase } from "../database";

export class QueryHelpers {
  private static getDb(): PostgresJsDatabase<any> {
    const db = getTestDatabase();
    if (!db) {
      throw new Error("Database not available");
    }
    return db;
  }

  static async findOne<T>(table: any, where: (table: any) => any): Promise<T | null> {
    const db = this.getDb();
    const result = await db.select().from(table).where(where(table)).limit(1);
    return (result[0] as T) || null;
  }

  static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static async findByEmail(table: any, emailColumn: any, email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    return this.findOne(table, (t) => and(eq(emailColumn, normalizedEmail), isNull(t.deletedAt)));
  }

  static async findBySlug(table: any, slugColumn: any, slug: string) {
    return this.findOne(table, (t) => and(eq(slugColumn, slug), isNull(t.deletedAt)));
  }

  static async exists(table: any, where: (table: any) => any): Promise<boolean> {
    const db = this.getDb();
    const result = await db.select().from(table).where(where(table)).limit(1);
    return result.length > 0;
  }
}
