import { Repository, PaginationResult, PaginationParams, TransactionContext } from "@nubbix/domain";
import { Event } from "../Event";
import { EventUrl } from "../vo/EventUrl";
import { EventFilters } from "./EventFilters";

export interface EventRepository extends Repository<Event> {
  findByUrl(accountId: string, url: EventUrl): Promise<Event | null>;
  existsByUrl(accountId: string, url: EventUrl): Promise<boolean>;
  findByAccountId(accountId: string): Promise<Event[]>;
  findMany(
    accountId: string,
    filters: EventFilters,
    pagination: PaginationParams,
    tx?: TransactionContext
  ): Promise<PaginationResult<Event>>;
}
