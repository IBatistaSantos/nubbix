import { BaseUseCase, createZodValidator, PaginationParams } from "@nubbix/domain";
import { EventRepository, EventFilters } from "../../domain";
import { ListEventsQuery, ListEventsOutput, listEventsQuerySchema } from "../dtos/ListEventsDTO";
import { sortEventDates } from "../utils/sortEventDates";

export class ListEventsUseCase extends BaseUseCase<ListEventsQuery, ListEventsOutput> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<ListEventsQuery>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(listEventsQuerySchema);
  }

  protected async execute(query: ListEventsQuery): Promise<ListEventsOutput> {
    const filters: EventFilters = {};

    if (query.tags) {
      filters.tags = query.tags;
    }

    if (query.type) {
      filters.type = query.type;
    }

    if (query.ticketSalesEnabled !== undefined) {
      filters.ticketSalesEnabled = query.ticketSalesEnabled;
    }

    if (query.ticketSalesStatus) {
      filters.ticketSalesStatus = query.ticketSalesStatus;
    }

    const pagination: PaginationParams = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    };

    const result = await this.eventRepository.findMany(query.accountId, filters, pagination);

    const events = result.data.map((event) => {
      const sortedDates = sortEventDates(event.dates);
      const json = event.toJSON();
      return {
        ...json,
        dates: sortedDates.map((date) => date.toJSON()),
      };
    });

    return {
      events,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
