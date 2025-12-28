import { ID, Email, Status, StatusValue } from "@nubbix/domain";
import { eq, and, isNull } from "drizzle-orm";
import { User, UserRepository } from "../../domain";
import { users } from "../../../../shared/infrastructure/db";
import { BaseDrizzleRepository } from "../../../../shared/infrastructure/repositories/BaseDrizzleRepository";

type UserSchema = typeof users.$inferSelect;

export class DrizzleUserRepository
  extends BaseDrizzleRepository<User, UserSchema>
  implements UserRepository
{
  protected getTable() {
    return users;
  }

  protected toDomain(schema: UserSchema): User {
    const status = schema.status === StatusValue.ACTIVE ? Status.active() : Status.inactive();

    return new User({
      id: schema.id,
      name: schema.name,
      email: schema.email,
      password: schema.password ?? null,
      avatar: schema.avatar ?? undefined,
      accountId: schema.accountId,
      role: schema.role as any,
      resetPasswordToken: schema.resetPasswordToken ?? null,
      resetPasswordTokenExpiresAt: schema.resetPasswordTokenExpiresAt ?? null,
      status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: schema.deletedAt ?? null,
    });
  }

  protected toSchema(entity: User): Partial<UserSchema> & { id: string } {
    return {
      id: entity.id.value,
      name: entity.name,
      email: entity.email.value,
      password: entity.password,
      avatar: entity.avatar ?? null,
      accountId: entity.accountId,
      role: entity.role.value as any,
      resetPasswordToken: entity.resetPasswordToken ?? null,
      resetPasswordTokenExpiresAt: entity.resetPasswordTokenExpiresAt ?? null,
      status: entity.status.value as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }

  async findByEmail(email: Email): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email.value), isNull(users.deletedAt)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const result = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, email.value), isNull(users.deletedAt)))
      .limit(1);

    return result.length > 0;
  }

  async existsByEmailAndAccountId(email: Email, accountId: ID): Promise<boolean> {
    const result = await this.db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email.value),
          eq(users.accountId, accountId.value),
          isNull(users.deletedAt)
        )
      )
      .limit(1);

    return result.length > 0;
  }

  async findByEmailAndAccountId(email: Email, accountId: ID): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email.value),
          eq(users.accountId, accountId.value),
          isNull(users.deletedAt)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }
}
