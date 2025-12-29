import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { CreateEventUseCase } from "../CreateEventUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventTypeValue } from "../../../domain";
import { ID } from "@nubbix/domain";
import { ConflictError } from "../../../../../shared/errors";

describe("CreateEventUseCase", () => {
  let useCase: CreateEventUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();

    useCase = new CreateEventUseCase(eventRepository);
  });

  it("should create event successfully", async () => {
    const accountId = ID.create().value;
    const input = {
      accountId,
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      type: EventTypeValue.DIGITAL as EventTypeValue,
      url: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
      address: null,
      maxCapacity: faker.number.int({ min: 10, max: 1000 }),
      ticketSales: {
        enabled: true,
        status: "open" as const,
      },
      tags: ["tech", "business"],
      dates: [
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output).toHaveProperty("id");
    expect(output.name).toBe(input.name);
    expect(output.description).toBe(input.description);
    expect(output.type).toBe(input.type);
    expect(output.url).toBe(input.url);
    expect(output.dates.length).toBe(1);

    const savedEvent = await eventRepository.findById(ID.create(output.id));
    expect(savedEvent).not.toBeNull();
  });

  it("should throw error when URL already exists in account", async () => {
    const accountId = ID.create().value;
    const url = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();

    const existingEvent = Event.asFaker({
      accountId,
      url,
    });
    await eventRepository.save(existingEvent);

    const input = {
      accountId,
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      type: EventTypeValue.DIGITAL as EventTypeValue,
      url,
      address: null,
      maxCapacity: null,
      ticketSales: {
        enabled: false,
        status: "closed" as const,
      },
      tags: [],
      dates: [
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    await expect(useCase.run(input)).rejects.toThrow(ConflictError);
  });

  it("should create event with address", async () => {
    const accountId = ID.create().value;
    const input = {
      accountId,
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      type: EventTypeValue.IN_PERSON as EventTypeValue,
      url: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
      },
      maxCapacity: faker.number.int({ min: 10, max: 1000 }),
      ticketSales: {
        enabled: true,
        status: "open" as const,
      },
      tags: [],
      dates: [
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output.address).not.toBeNull();
    expect(output.address?.street).toBe(input.address.street);
    expect(output.address?.city).toBe(input.address.city);
  });

  it("should create event with multiple dates", async () => {
    const accountId = ID.create().value;
    const input = {
      accountId,
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      type: EventTypeValue.HYBRID as EventTypeValue,
      url: faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase(),
      address: null,
      maxCapacity: null,
      ticketSales: {
        enabled: true,
        status: "open" as const,
      },
      tags: [],
      dates: [
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
        },
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "16:00",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output.dates.length).toBe(2);
  });
});
