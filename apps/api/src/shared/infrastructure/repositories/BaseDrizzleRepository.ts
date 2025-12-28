import { BaseEntity, ID, Repository } from "@nubbix/domain";
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

  async findById(id: ID): Promise<TEntity | null> {
    const table = this.getTable();
    const result = await this.db
      .select()
      .from(table)
      .where(and(eq((table as any).id, id.value), isNull((table as any).deletedAt)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0] as TSchema);
  }

  async save(entity: TEntity): Promise<TEntity> {
    const table = this.getTable();
    const schema = this.toSchema(entity);

    const existing = await this.findById(entity.id);

    if (existing) {
      await this.db
        .update(table)
        .set({
          ...schema,
          updatedAt: new Date(),
        } as any)
        .where(eq((table as any).id, entity.id.value));

      return entity;
    } else {
      await this.db.insert(table).values(schema as any);
      return entity;
    }
  }

  async delete(id: ID): Promise<void> {
    const table = this.getTable();
    await this.db
      .update(table)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(eq((table as any).id, id.value));
  }

  async exists(id: ID): Promise<boolean> {
    const table = this.getTable();
    const result = await this.db
      .select()
      .from(table)
      .where(and(eq((table as any).id, id.value), isNull((table as any).deletedAt)))
      .limit(1);

    return result.length > 0;
  }
}
