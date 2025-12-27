import { Repository, Email, ID } from "@nubbix/domain";
import { User } from "../User";

export interface UserRepository extends Repository<User> {
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  existsByEmailAndAccountId(email: Email, accountId: ID): Promise<boolean>;
}

