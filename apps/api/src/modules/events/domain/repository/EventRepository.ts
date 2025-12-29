import { Repository } from "@nubbix/domain";
import { Event } from "../Event";
import { EventUrl } from "../vo/EventUrl";

export interface EventRepository extends Repository<Event> {
  findByUrl(accountId: string, url: EventUrl): Promise<Event | null>;
  existsByUrl(accountId: string, url: EventUrl): Promise<boolean>;
  findByAccountId(accountId: string): Promise<Event[]>;
}
