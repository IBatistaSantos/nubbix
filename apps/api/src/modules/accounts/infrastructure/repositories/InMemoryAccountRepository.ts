import { ID } from "@nubbix/domain";
import { Account, AccountRepository, Slug } from "../../domain";

export class InMemoryAccountRepository implements AccountRepository {
  private accounts: Map<string, Account> = new Map();
  private slugs: Map<string, string> = new Map(); // slug -> accountId

  async findById(id: ID): Promise<Account | null> {
    return this.accounts.get(id.value) || null;
  }

  async findBySlug(slug: Slug): Promise<Account | null> {
    const accountId = this.slugs.get(slug.value);
    if (!accountId) {
      return null;
    }
    return this.accounts.get(accountId) || null;
  }

  async existsBySlug(slug: Slug): Promise<boolean> {
    return this.slugs.has(slug.value);
  }

  async save(entity: Account): Promise<Account> {
    this.accounts.set(entity.id.value, entity);
    this.slugs.set(entity.slug.value, entity.id.value);
    return entity;
  }

  async delete(id: ID): Promise<void> {
    const account = this.accounts.get(id.value);
    if (account) {
      this.slugs.delete(account.slug.value);
      this.accounts.delete(id.value);
    }
  }

  async exists(id: ID): Promise<boolean> {
    return this.accounts.has(id.value);
  }
}
