import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { DuplicateEventUseCase } from "../DuplicateEventUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventTypeValue, Address, TicketSales, EventType } from "../../../domain";
import { ID } from "@nubbix/domain";
import { ConflictError, NotFoundError, BadRequestError } from "../../../../../shared/errors";

describe("DuplicateEventUseCase", () => {
  let useCase: DuplicateEventUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    useCase = new DuplicateEventUseCase(eventRepository);
  });

  it("should duplicate event successfully copying all properties from original", async () => {
    const accountId = ID.create().value;
    const originalEvent = Event.asFaker({
      accountId,
      description: faker.lorem.paragraph(),
      type: EventTypeValue.HYBRID as any,
      address: Address.create({
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
      }),
      maxCapacity: 100,
      ticketSales: TicketSales.enabled(),
      tags: ["tech", "business"],
    });
    await eventRepository.save(originalEvent);

    const newName = faker.company.catchPhrase();
    const newUrl = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
    const futureDate = faker.date.future().toISOString().split("T")[0];

    const input = {
      eventId: originalEvent.id.value,
      name: newName,
      url: newUrl,
      dates: [
        {
          date: futureDate,
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("id");
    expect(output.id).not.toBe(originalEvent.id.value);
    expect(output.name).toBe(newName);
    expect(output.url).toBe(newUrl);
    expect(output.description).toBe(originalEvent.description);
    expect(output.type).toBe(originalEvent.type.value);
    expect(output.accountId).toBe(originalEvent.accountId);
    expect(output.maxCapacity).toBe(originalEvent.maxCapacity);
    expect(output.ticketSales.enabled).toBe(originalEvent.ticketSales.enabled);
    expect(output.ticketSales.status).toBe(originalEvent.ticketSales.status);
    expect(output.tags).toEqual(originalEvent.tags);
    expect(output.address).not.toBeNull();
    expect(output.address?.street).toBe(originalEvent.address?.street);
    expect(output.address?.city).toBe(originalEvent.address?.city);
    expect(output.dates.length).toBe(1);
    expect(output.dates[0].date).toBe(futureDate);
    expect(output.dates[0].startTime).toBe("10:00");
    expect(output.dates[0].endTime).toBe("12:00");
    expect(output.dates[0].finished).toBe(false);
    expect(output.dates[0].finishedAt).toBeNull();

    const savedEvent = await eventRepository.findById(ID.create(output.id));
    expect(savedEvent).not.toBeNull();
  });

  it("should throw NotFoundError when original event does not exist", async () => {
    const nonExistentId = ID.create().value;
    const futureDate = faker.date.future().toISOString().split("T")[0];

    const input = {
      eventId: nonExistentId,
      name: faker.company.catchPhrase(),
      url: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
      dates: [
        {
          date: futureDate,
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should throw ConflictError when new URL already exists in account", async () => {
    const accountId = ID.create().value;
    const existingUrl = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();

    const originalEvent = Event.asFaker({ accountId });
    await eventRepository.save(originalEvent);

    const existingEvent = Event.asFaker({
      accountId,
      url: existingUrl,
    });
    await eventRepository.save(existingEvent);

    const futureDate = faker.date.future().toISOString().split("T")[0];

    const input = {
      eventId: originalEvent.id.value,
      name: faker.company.catchPhrase(),
      url: existingUrl,
      dates: [
        {
          date: futureDate,
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    await expect(useCase.run(input)).rejects.toThrow(ConflictError);
  });

  it("should throw BadRequestError when dates are in the past", async () => {
    const accountId = ID.create().value;
    const originalEvent = Event.asFaker({ accountId });
    await eventRepository.save(originalEvent);

    const pastDate = faker.date.past().toISOString().split("T")[0];

    const input = {
      eventId: originalEvent.id.value,
      name: faker.company.catchPhrase(),
      url: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
      dates: [
        {
          date: pastDate,
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    await expect(useCase.run(input)).rejects.toThrow(BadRequestError);
  });

  it("should copy description, type, address, maxCapacity, ticketSales, tags from original", async () => {
    const accountId = ID.create().value;
    const originalDescription = faker.lorem.paragraph();
    const originalType = EventType.inPerson();
    const originalAddress = Address.create({
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country: faker.location.country(),
    });
    const originalMaxCapacity = 200;
    const originalTicketSales = TicketSales.disabled();
    const originalTags = ["education", "workshop"];

    const originalEvent = Event.asFaker({
      accountId,
      description: originalDescription,
      type: originalType,
      address: originalAddress,
      maxCapacity: originalMaxCapacity,
      ticketSales: originalTicketSales,
      tags: originalTags,
    });
    await eventRepository.save(originalEvent);

    const futureDate = faker.date.future().toISOString().split("T")[0];

    const input = {
      eventId: originalEvent.id.value,
      name: faker.company.catchPhrase(),
      url: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
      dates: [
        {
          date: futureDate,
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output.description).toBe(originalDescription);
    expect(output.type).toBe(originalType.value);
    expect(output.address?.street).toBe(originalAddress.street);
    expect(output.address?.city).toBe(originalAddress.city);
    expect(output.maxCapacity).toBe(originalMaxCapacity);
    expect(output.ticketSales.enabled).toBe(originalTicketSales.enabled);
    expect(output.ticketSales.status).toBe(originalTicketSales.status);
    expect(output.tags).toEqual(originalTags);
  });
});
