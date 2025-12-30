import { BaseUseCase, createZodValidator } from "@nubbix/domain";
import { EventRepository, Event } from "../../domain";
import { EventDate } from "../../domain/vo/EventDate";
import {
  GetEventStatsQuery,
  GetEventStatsOutput,
  getEventStatsQuerySchema,
} from "../dtos/GetEventStatsDTO";

interface ProcessedEvent {
  eventType: string;
  createdAt: Date;
  isActive: boolean;
  nextUpcomingDate: Date | null;
  eventId: string;
  eventName: string;
}

const MONTHS_ABBREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export class GetEventStatsUseCase extends BaseUseCase<GetEventStatsQuery, GetEventStatsOutput> {
  constructor(private eventRepository: EventRepository) {
    super();
  }

  protected getInputValidator(): ReturnType<typeof createZodValidator<GetEventStatsQuery>> {
    // @ts-expect-error - Zod schema type inference
    return createZodValidator(getEventStatsQuerySchema);
  }

  protected async execute(query: GetEventStatsQuery): Promise<GetEventStatsOutput> {
    const events = await this.eventRepository.findByAccountId(query.accountId);

    if (events.length === 0) {
      return {
        totalEvents: 0,
        activeEvents: 0,
        eventTypes: 0,
        eventsThisMonth: 0,
        nextEvent: null,
      };
    }

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const nowTime = now.getTime();

    const stats = this.processEvents(events, now, nowTime, thisMonth, thisYear);

    return {
      totalEvents: events.length,
      activeEvents: stats.activeEvents,
      eventTypes: stats.eventTypes.size,
      eventsThisMonth: stats.eventsThisMonth,
      nextEvent: stats.nextEvent,
    };
  }

  private processEvents(
    events: Event[],
    now: Date,
    nowTime: number,
    thisMonth: number,
    thisYear: number
  ) {
    const eventTypes = new Set<string>();
    let activeEvents = 0;
    let eventsThisMonth = 0;
    let nextUpcomingEvent: ProcessedEvent | null = null;

    for (const event of events) {
      eventTypes.add(event.type.value);

      const createdAt = event.createdAt;
      if (createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear) {
        eventsThisMonth++;
      }

      if (event.status.isInactive()) {
        continue;
      }

      const dateInfo = this.processEventDates(event.dates, nowTime);

      if (dateInfo.hasActiveDate) {
        activeEvents++;
      }

      if (dateInfo.nextUpcomingDate) {
        const nextDateTime = dateInfo.nextUpcomingDate.getTime();
        if (!nextUpcomingEvent || nextDateTime < nextUpcomingEvent.nextUpcomingDate!.getTime()) {
          nextUpcomingEvent = {
            eventType: event.type.value,
            createdAt,
            isActive: dateInfo.hasActiveDate,
            nextUpcomingDate: dateInfo.nextUpcomingDate,
            eventId: event.id.value,
            eventName: event.name,
          };
        }
      }
    }

    const nextEvent = nextUpcomingEvent ? this.formatNextEvent(nextUpcomingEvent, nowTime) : null;

    return {
      eventTypes,
      activeEvents,
      eventsThisMonth,
      nextEvent,
    };
  }

  private processEventDates(
    dates: EventDate[],
    nowTime: number
  ): { hasActiveDate: boolean; nextUpcomingDate: Date | null } {
    let hasActiveDate = false;
    let nextUpcomingDate: Date | null = null;

    for (const date of dates) {
      if (date.finished) {
        continue;
      }

      const startDate = this.parseEventDateTime(date.date, date.startTime);
      const endDate = this.parseEventDateTime(date.date, date.endTime);
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      if (startTime <= nowTime && endTime >= nowTime) {
        hasActiveDate = true;
      }

      if (startTime > nowTime) {
        if (!nextUpcomingDate || startTime < nextUpcomingDate.getTime()) {
          nextUpcomingDate = startDate;
        }
      }
    }

    return { hasActiveDate, nextUpcomingDate };
  }

  private parseEventDateTime(date: string, time: string): Date {
    return new Date(`${date}T${time}`);
  }

  private formatNextEvent(
    event: ProcessedEvent,
    nowTime: number
  ): GetEventStatsOutput["nextEvent"] {
    if (!event.nextUpcomingDate) {
      return null;
    }

    const eventTime = event.nextUpcomingDate.getTime();
    const daysUntil = Math.ceil((eventTime - nowTime) / MILLISECONDS_PER_DAY);
    const formattedDate = `${event.nextUpcomingDate.getDate()} ${MONTHS_ABBREV[event.nextUpcomingDate.getMonth()]}`;

    return {
      id: event.eventId,
      name: event.eventName,
      date: formattedDate,
      daysUntil,
    };
  }
}
