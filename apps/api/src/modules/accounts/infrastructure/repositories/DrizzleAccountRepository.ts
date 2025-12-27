import { ID, Status, StatusValue } from "@nubbix/domain";
import { eq, and, isNull } from "drizzle-orm";
import { Account, AccountRepository, AccountType, Slug } from "../../domain";
import { accounts } from "../../../../shared/infrastructure/db";
import { BaseDrizzleRepository } from "../../../../shared/infrastructure/repositories/BaseDrizzleRepository";

type AccountSchema = typeof accounts.$inferSelect;
type AccountInsert = typeof accounts.$inferInsert;

export class DrizzleAccountRepository
  extends BaseDrizzleRepository<Account, AccountSchema>
  implements AccountRepository
{
  protected getTable() {
    return accounts;
  }

  protected toDomain(schema: AccountSchema): Account {
    const status = schema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();

    return new Account({
      id: schema.id,
      name: schema.name,
      slug: schema.slug,
      description: schema.description ?? null,
      website: schema.website ?? null,
      logo: schema.logo ?? null,
      accountType: AccountType.fromValue(schema.accountType as any),
      status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: schema.deletedAt ?? null,
    });
  }

  protected toSchema(entity: Account): Partial<AccountSchema> & { id: string } {
    return {
      id: entity.id.value,
      name: entity.name,
      slug: entity.slug.value,
      description: entity.description ?? null,
      website: entity.website ?? null,
      logo: entity.logo ?? null,
      accountType: entity.accountType.value as any,
      status: entity.status.value as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  async findBySlug(slug: Slug): Promise<Account | null> {
    const result = await this.db
      .select()
      .from(accounts)
      .where(and(eq(accounts.slug, slug.value), isNull(accounts.deletedAt)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async existsBySlug(slug: Slug): Promise<boolean> {
    const result = await this.db
      .select()
      .from(accounts)
      .where(and(eq(accounts.slug, slug.value), isNull(accounts.deletedAt)))
      .limit(1);

    return result.length > 0;
  }
}
