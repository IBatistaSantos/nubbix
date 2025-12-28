import { BaseEntity } from "../entity/BaseEntity";
import { ID } from "../vo/ID";
import { TransactionContext } from "./TransactionManager";

export interface Repository<T extends BaseEntity> {
  findById(id: ID, tx?: TransactionContext): Promise<T | null>;
  save(entity: T, tx?: TransactionContext): Promise<T>;
  delete(id: ID, tx?: TransactionContext): Promise<void>;
  exists(id: ID, tx?: TransactionContext): Promise<boolean>;
}
