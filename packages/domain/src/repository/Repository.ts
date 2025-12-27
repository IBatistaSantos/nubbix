import { BaseEntity } from "../entity/BaseEntity";
import { ID } from "../vo/ID";

export interface Repository<T extends BaseEntity> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}
