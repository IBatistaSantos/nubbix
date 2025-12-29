import { ID, PaginationResult, PaginationParams, TransactionContext } from "@nubbix/domain";
import { Event, EventRepository, EventUrl, EventFilters } from "../../../domain";

export class InMemoryEventRepository implements EventRepository {
  private events: Map<string, Event> = new Map();
  private urls: Map<string, Set<string>> = new Map();

  async findById(id: ID, _tx?: TransactionContext): Promise<Event | null> {
    return this.events.get(id.value) || null;
  }

  async save(entity: Event, _tx?: TransactionContext): Promise<Event> {
    this.events.set(entity.id.value, entity);
    const accountUrls = this.urls.get(entity.accountId) || new Set();
    accountUrls.add(entity.url.value);
    this.urls.set(entity.accountId, accountUrls);
    return entity;
  }

  async delete(id: ID, _tx?: TransactionContext): Promise<void> {
    const event = this.events.get(id.value);
    if (event) {
      const accountUrls = this.urls.get(event.accountId);
      if (accountUrls) {
        accountUrls.delete(event.url.value);
      }
      this.events.delete(id.value);
    }
  }

  async exists(id: ID, _tx?: TransactionContext): Promise<boolean> {
    return this.events.has(id.value);
  }

  async findByUrl(accountId: string, url: EventUrl): Promise<Event | null> {
    for (const event of this.events.values()) {
      if (event.accountId === accountId && event.url.equals(url)) {
        return event;
      }
    }
    return null;
  }

  async existsByUrl(accountId: string, url: EventUrl): Promise<boolean> {
    return (await this.findByUrl(accountId, url)) !== null;
  }

  async findByAccountId(accountId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter((event) => event.accountId === accountId);
  }

  async findMany(
    accountId: string,
    filters: EventFilters,
    pagination: PaginationParams,
    _tx?: TransactionContext
  ): Promise<PaginationResult<Event>> {
    let events = Array.from(this.events.values()).filter((event) => event.accountId === accountId);

    if (filters.tags && filters.tags.length > 0) {
      events = events.filter((event) => {
        const eventTags = event.tags || [];
        return filters.tags!.some((tag) => eventTags.includes(tag));
      });
    }

    if (filters.type) {
      events = events.filter((event) => event.type.value === filters.type);
    }

    if (filters.ticketSalesEnabled !== undefined) {
      events = events.filter((event) => event.ticketSales.enabled === filters.ticketSalesEnabled);
    }

    if (filters.ticketSalesStatus) {
      events = events.filter((event) => event.ticketSales.status === filters.ticketSalesStatus);
    }

    const total = events.length;
    const page = pagination.page;
    const limit = pagination.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedEvents,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
