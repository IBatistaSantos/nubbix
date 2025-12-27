import { Repository } from "@nubbix/domain";
import { Account } from "../Account";
import { Slug } from "../vo/Slug";

export interface AccountRepository extends Repository<Account> {
  findBySlug(slug: Slug): Promise<Account | null>;
  existsBySlug(slug: Slug): Promise<boolean>;
}

