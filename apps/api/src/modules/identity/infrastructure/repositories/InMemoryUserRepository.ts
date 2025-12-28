import { Email, ID } from "@nubbix/domain";
import { User, UserRepository } from "../../domain";

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  private emails: Map<string, string> = new Map(); // email -> userId
  private emailsByAccount: Map<string, Set<string>> = new Map(); // accountId -> Set<email>

  async findById(id: ID): Promise<User | null> {
    return this.users.get(id.value) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userId = this.emails.get(email.value);
    if (!userId) {
      return null;
    }
    return this.users.get(userId) || null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    return this.emails.has(email.value);
  }

  async existsByEmailAndAccountId(email: Email, accountId: ID): Promise<boolean> {
    const accountEmails = this.emailsByAccount.get(accountId.value);
    if (!accountEmails) {
      return false;
    }
    return accountEmails.has(email.value);
  }

  async findByEmailAndAccountId(email: Email, accountId: ID): Promise<User | null> {
    const accountEmails = this.emailsByAccount.get(accountId.value);
    if (!accountEmails || !accountEmails.has(email.value)) {
      return null;
    }

    for (const user of this.users.values()) {
      if (user.email.value === email.value && user.accountId === accountId.value) {
        return user;
      }
    }

    return null;
  }

  async save(entity: User): Promise<User> {
    this.users.set(entity.id.value, entity);
    this.emails.set(entity.email.value, entity.id.value);

    if (!this.emailsByAccount.has(entity.accountId)) {
      this.emailsByAccount.set(entity.accountId, new Set());
    }
    this.emailsByAccount.get(entity.accountId)!.add(entity.email.value);

    return entity;
  }

  async delete(id: ID): Promise<void> {
    const user = this.users.get(id.value);
    if (user) {
      this.emails.delete(user.email.value);
      const accountEmails = this.emailsByAccount.get(user.accountId);
      if (accountEmails) {
        accountEmails.delete(user.email.value);
        if (accountEmails.size === 0) {
          this.emailsByAccount.delete(user.accountId);
        }
      }
      this.users.delete(id.value);
    }
  }

  async exists(id: ID): Promise<boolean> {
    return this.users.has(id.value);
  }
}
