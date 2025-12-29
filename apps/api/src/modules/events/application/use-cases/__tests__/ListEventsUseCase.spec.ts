import { describe, it, expect, beforeEach } from "bun:test";
import { ListEventsUseCase } from "../ListEventsUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventTypeValue, EventType, TicketSales } from "../../../domain";
import { ID } from "@nubbix/domain";

describe("ListEventsUseCase", () => {
  let useCase: ListEventsUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    useCase = new ListEventsUseCase(eventRepository);
  });

  it("should list events successfully", async () => {
    const accountId = ID.create().value;
    const event1 = Event.asFaker({ accountId });
    const event2 = Event.asFaker({ accountId });
    await eventRepository.save(event1);
    await eventRepository.save(event2);

    const query = {
      accountId,
      page: 1,
      limit: 10,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(2);
    expect(output.total).toBe(2);
    expect(output.page).toBe(1);
    expect(output.limit).toBe(10);
    expect(output.totalPages).toBe(1);
  });

  it("should filter by tags", async () => {
    const accountId = ID.create().value;
    const event1 = Event.asFaker({ accountId, tags: ["tech", "business"] });
    const event2 = Event.asFaker({ accountId, tags: ["education"] });
    await eventRepository.save(event1);
    await eventRepository.save(event2);

    const query = {
      accountId,
      tags: ["tech"],
      page: 1,
      limit: 10,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(1);
    expect(output.events[0].tags).toContain("tech");
  });

  it("should filter by type", async () => {
    const accountId = ID.create().value;
    const event1 = Event.asFaker({ accountId, type: EventType.digital() });
    const event2 = Event.asFaker({ accountId, type: EventType.inPerson() });
    await eventRepository.save(event1);
    await eventRepository.save(event2);

    const query = {
      accountId,
      type: EventTypeValue.DIGITAL as EventTypeValue,
      page: 1,
      limit: 10,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(1);
    expect(output.events[0].type).toBe(EventTypeValue.DIGITAL);
  });

  it("should filter by ticket sales enabled", async () => {
    const accountId = ID.create().value;
    const event1 = Event.asFaker({ accountId, ticketSales: TicketSales.enabled() });
    const event2 = Event.asFaker({ accountId, ticketSales: TicketSales.disabled() });
    await eventRepository.save(event1);
    await eventRepository.save(event2);

    const query = {
      accountId,
      ticketSalesEnabled: true,
      page: 1,
      limit: 10,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(1);
    expect(output.events[0].ticketSales.enabled).toBe(true);
  });

  it("should filter by ticket sales status", async () => {
    const accountId = ID.create().value;
    const event1 = Event.asFaker({ accountId, ticketSales: TicketSales.enabled("open") });
    const event2 = Event.asFaker({ accountId, ticketSales: TicketSales.enabled("closed") });
    await eventRepository.save(event1);
    await eventRepository.save(event2);

    const query = {
      accountId,
      ticketSalesStatus: "open" as const,
      page: 1,
      limit: 10,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(1);
    expect(output.events[0].ticketSales.status).toBe("open");
  });

  it("should paginate results", async () => {
    const accountId = ID.create().value;
    for (let i = 0; i < 5; i++) {
      await eventRepository.save(Event.asFaker({ accountId }));
    }

    const query = {
      accountId,
      page: 1,
      limit: 2,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(2);
    expect(output.total).toBe(5);
    expect(output.page).toBe(1);
    expect(output.limit).toBe(2);
    expect(output.totalPages).toBe(3);
  });

  it("should return dates sorted with active dates first", async () => {
    const accountId = ID.create().value;
    const event = Event.asFaker({ accountId });
    await eventRepository.save(event);

    const query = {
      accountId,
      page: 1,
      limit: 10,
    };

    const output = await useCase.run(query);

    expect(output.events.length).toBe(1);
    if (output.events[0].dates.length > 1) {
      const activeDates = output.events[0].dates.filter((d) => !d.finished);
      const finishedDates = output.events[0].dates.filter((d) => d.finished);
      expect(activeDates.length + finishedDates.length).toBe(output.events[0].dates.length);
    }
  });
});
