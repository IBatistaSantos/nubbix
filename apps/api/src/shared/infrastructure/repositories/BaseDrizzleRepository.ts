import { BaseEntity, ID, Repository, TransactionContext } from "@nubbix/domain";
import { eq, and, isNull } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { db } from "../db";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export abstract class BaseDrizzleRepository<
  TEntity extends BaseEntity,
  TSchema,
> implements Repository<TEntity> {
  protected readonly db: PostgresJsDatabase<any>;

  constructor(database?: PostgresJsDatabase<any>) {
    this.db = database || db;
  }

  protected abstract toDomain(schema: TSchema): TEntity;

  protected abstract toSchema(entity: TEntity): Partial<TSchema> & { id: string };

  protected abstract getTable(): PgTable<any>;

  protected getDatabase(tx?: TransactionContext): PostgresJsDatabase<any> {
    if (tx) {
      return tx as PostgresJsDatabase<any>;
    }
    return this.db;
  }

  async findById(id: ID, tx?: TransactionContext): Promise<TEntity | null> {
    const table = this.getTable();
    const database = this.getDatabase(tx);
    const result = await database
      .select()
      .from(table)
      .where(and(eq((table as any).id, id.value), isNull((table as any).deletedAt)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0] as TSchema);
  }

  async save(entity: TEntity, tx?: TransactionContext): Promise<TEntity> {
    const table = this.getTable();
    const schema = this.toSchema(entity);
    const database = this.getDatabase(tx);

    const existing = await this.findById(entity.id, tx);

    if (existing) {
      await database
        .update(table)
        .set({
          ...schema,
          updatedAt: new Date(),
        } as any)
        .where(eq((table as any).id, entity.id.value));

      return entity;
    } else {
      await database.insert(table).values(schema as any);
      return entity;
    }
  }

  async delete(id: ID, tx?: TransactionContext): Promise<void> {
    const table = this.getTable();
    const database = this.getDatabase(tx);
    await database
      .update(table)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(eq((table as any).id, id.value));
  }

  async exists(id: ID, tx?: TransactionContext): Promise<boolean> {
    const table = this.getTable();
    const database = this.getDatabase(tx);
    const result = await database
      .select()
      .from(table)
      .where(and(eq((table as any).id, id.value), isNull((table as any).deletedAt)))
      .limit(1);

    return result.length > 0;
  }
}
