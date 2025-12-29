import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { UpdateEventUseCase } from "../UpdateEventUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventTypeValue } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("UpdateEventUseCase", () => {
  let useCase: UpdateEventUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    useCase = new UpdateEventUseCase(eventRepository);
  });

  it("should update event successfully", async () => {
    const event = Event.asFaker();
    await eventRepository.save(event);

    const input = {
      eventId: event.id.value,
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
    };

    const output = await useCase.run(input);

    expect(output.name).toBe(input.name);
    expect(output.description).toBe(input.description);
  });

  it("should throw error when event not found", async () => {
    const input = {
      eventId: ID.create().value,
      name: faker.company.catchPhrase(),
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should update event type", async () => {
    const event = Event.asFaker({
      type: EventTypeValue.DIGITAL as any,
    });
    await eventRepository.save(event);

    const input = {
      eventId: event.id.value,
      type: EventTypeValue.IN_PERSON as EventTypeValue,
    };

    const output = await useCase.run(input);

    expect(output.type).toBe(EventTypeValue.IN_PERSON);
  });

  it("should update address", async () => {
    const event = Event.asFaker();
    await eventRepository.save(event);

    const input = {
      eventId: event.id.value,
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
      },
    };

    const output = await useCase.run(input);

    expect(output.address).not.toBeNull();
    expect(output.address?.street).toBe(input.address.street);
  });

  it("should update tags", async () => {
    const event = Event.asFaker();
    await eventRepository.save(event);

    const input = {
      eventId: event.id.value,
      tags: ["tech", "business", "networking"],
    };

    const output = useCase.run(input);

    expect(output).resolves.toHaveProperty("tags");
  });
});
