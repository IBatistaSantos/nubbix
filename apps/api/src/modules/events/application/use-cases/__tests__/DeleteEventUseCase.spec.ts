import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { DeleteEventUseCase } from "../DeleteEventUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventType, TicketSales, EventDate } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("DeleteEventUseCase", () => {
  let useCase: DeleteEventUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    useCase = new DeleteEventUseCase(eventRepository);
  });

  it("should deactivate event successfully", async () => {
    const accountId = ID.create().value;
    const event = Event.asFaker({ accountId });
    await eventRepository.save(event);

    await useCase.run(event.id.value);

    const deactivatedEvent = await eventRepository.findById(event.id);
    expect(deactivatedEvent).not.toBeNull();
    expect(deactivatedEvent?.status.isInactive()).toBe(true);
    expect(deactivatedEvent?.deletedAt).not.toBeNull();
  });

  it("should throw NotFoundError when event does not exist", async () => {
    const nonExistentId = ID.create().value;

    await expect(useCase.run(nonExistentId)).rejects.toThrow(NotFoundError);
  });

  it("should deactivate event with multiple dates", async () => {
    const accountId = ID.create().value;
    const futureDate1 = faker.date.future().toISOString().split("T")[0];
    const futureDate2 = faker.date.future().toISOString().split("T")[0];

    const event = Event.asFaker({
      accountId,
      dates: [
        EventDate.create({
          id: ID.create(),
          date: futureDate1,
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        }),
        EventDate.create({
          id: ID.create(),
          date: futureDate2,
          startTime: "14:00",
          endTime: "16:00",
          finished: false,
          finishedAt: null,
        }),
      ],
    });
    await eventRepository.save(event);

    await useCase.run(event.id.value);

    const deactivatedEvent = await eventRepository.findById(event.id);
    expect(deactivatedEvent).not.toBeNull();
    expect(deactivatedEvent?.status.isInactive()).toBe(true);
    expect(deactivatedEvent?.deletedAt).not.toBeNull();
    expect(deactivatedEvent?.dates.length).toBe(2);
  });

  it("should deactivate event with different types", async () => {
    const accountId = ID.create().value;
    const digitalEvent = Event.asFaker({ accountId, type: EventType.digital() });
    const inPersonEvent = Event.asFaker({ accountId, type: EventType.inPerson() });

    await eventRepository.save(digitalEvent);
    await eventRepository.save(inPersonEvent);

    await useCase.run(digitalEvent.id.value);

    const deactivatedDigitalEvent = await eventRepository.findById(digitalEvent.id);
    const existingInPersonEvent = await eventRepository.findById(inPersonEvent.id);

    expect(deactivatedDigitalEvent).not.toBeNull();
    expect(deactivatedDigitalEvent?.status.isInactive()).toBe(true);
    expect(deactivatedDigitalEvent?.deletedAt).not.toBeNull();
    expect(existingInPersonEvent).not.toBeNull();
    expect(existingInPersonEvent?.status.isActive()).toBe(true);
    expect(existingInPersonEvent?.id.value).toBe(inPersonEvent.id.value);
  });

  it("should deactivate event with ticket sales enabled", async () => {
    const accountId = ID.create().value;
    const event = Event.asFaker({
      accountId,
      ticketSales: TicketSales.enabled("open"),
    });
    await eventRepository.save(event);

    await useCase.run(event.id.value);

    const deactivatedEvent = await eventRepository.findById(event.id);
    expect(deactivatedEvent).not.toBeNull();
    expect(deactivatedEvent?.status.isInactive()).toBe(true);
    expect(deactivatedEvent?.deletedAt).not.toBeNull();
    expect(deactivatedEvent?.ticketSales.enabled).toBe(true);
  });

  it("should deactivate event with tags", async () => {
    const accountId = ID.create().value;
    const tags = faker.helpers.arrayElements(
      ["tech", "business", "networking", "education", "workshop"],
      { min: 1, max: 5 }
    );
    const event = Event.asFaker({ accountId, tags });
    await eventRepository.save(event);

    await useCase.run(event.id.value);

    const deactivatedEvent = await eventRepository.findById(event.id);
    expect(deactivatedEvent).not.toBeNull();
    expect(deactivatedEvent?.status.isInactive()).toBe(true);
    expect(deactivatedEvent?.deletedAt).not.toBeNull();
    expect(deactivatedEvent?.tags).toEqual(tags);
  });

  it("should deactivate event and verify only target event is deactivated", async () => {
    const accountId = ID.create().value;
    const event1 = Event.asFaker({ accountId });
    const event2 = Event.asFaker({ accountId });
    const event3 = Event.asFaker({ accountId });

    await eventRepository.save(event1);
    await eventRepository.save(event2);
    await eventRepository.save(event3);

    await useCase.run(event2.id.value);

    const deactivatedEvent = await eventRepository.findById(event2.id);
    const existingEvent1 = await eventRepository.findById(event1.id);
    const existingEvent3 = await eventRepository.findById(event3.id);

    expect(deactivatedEvent).not.toBeNull();
    expect(deactivatedEvent?.status.isInactive()).toBe(true);
    expect(deactivatedEvent?.deletedAt).not.toBeNull();
    expect(existingEvent1).not.toBeNull();
    expect(existingEvent1?.status.isActive()).toBe(true);
    expect(existingEvent3).not.toBeNull();
    expect(existingEvent3?.status.isActive()).toBe(true);
  });
});
