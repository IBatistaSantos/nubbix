import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { UpdateEventDatesUseCase } from "../UpdateEventDatesUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventDate } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("UpdateEventDatesUseCase", () => {
  let useCase: UpdateEventDatesUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    useCase = new UpdateEventDatesUseCase(eventRepository);
  });

  it("should add date successfully", async () => {
    const event = Event.asFaker();
    await eventRepository.save(event);
    const initialDatesCount = event.dates.length;

    const input = {
      eventId: event.id.value,
      add: [
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "16:00",
        },
      ],
    };

    const output = await useCase.run(input);

    expect(output.dates.length).toBe(initialDatesCount + 1);
  });

  it("should update date successfully", async () => {
    const event = Event.asFaker();
    await eventRepository.save(event);
    const dateId = event.dates[0].id.value;

    const input = {
      eventId: event.id.value,
      update: [
        {
          dateId,
          startTime: "15:00",
          endTime: "17:00",
        },
      ],
    };

    const output = await useCase.run(input);

    const updatedDate = output.dates.find((d) => d.id === dateId);
    expect(updatedDate).not.toBeUndefined();
    expect(updatedDate?.startTime).toBe("15:00");
    expect(updatedDate?.endTime).toBe("17:00");
  });

  it("should remove date successfully", async () => {
    const event = Event.asFaker({
      dates: [
        EventDate.create({
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        }),
        EventDate.create({
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "16:00",
          finished: false,
          finishedAt: null,
        }),
      ],
    });
    await eventRepository.save(event);
    const dateId = event.dates[0].id.value;

    const input = {
      eventId: event.id.value,
      remove: [dateId],
    };

    const output = await useCase.run(input);

    expect(output.dates.length).toBe(1);
    expect(output.dates.find((d) => d.id === dateId)).toBeUndefined();
  });

  it("should throw error when event not found", async () => {
    const input = {
      eventId: ID.create().value,
      add: [
        {
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "10:00",
          endTime: "12:00",
        },
      ],
    };

    await expect(useCase.run(input)).rejects.toThrow(NotFoundError);
  });

  it("should not allow updating finished date", async () => {
    const finishedDate = EventDate.create({
      date: faker.date.past().toISOString().split("T")[0],
      startTime: "10:00",
      endTime: "12:00",
      finished: true,
      finishedAt: new Date().toISOString(),
    });
    const event = Event.asFaker({
      dates: [
        finishedDate,
        EventDate.create({
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "16:00",
          finished: false,
          finishedAt: null,
        }),
      ],
    });
    await eventRepository.save(event);

    const input = {
      eventId: event.id.value,
      update: [
        {
          dateId: finishedDate.id.value,
          startTime: "15:00",
        },
      ],
    };

    await expect(useCase.run(input)).rejects.toThrow();
  });

  it("should not allow removing finished date", async () => {
    const finishedDate = EventDate.create({
      date: faker.date.past().toISOString().split("T")[0],
      startTime: "10:00",
      endTime: "12:00",
      finished: true,
      finishedAt: new Date().toISOString(),
    });
    const event = Event.asFaker({
      dates: [
        finishedDate,
        EventDate.create({
          date: faker.date.future().toISOString().split("T")[0],
          startTime: "14:00",
          endTime: "16:00",
          finished: false,
          finishedAt: null,
        }),
      ],
    });
    await eventRepository.save(event);

    const input = {
      eventId: event.id.value,
      remove: [finishedDate.id.value],
    };

    await expect(useCase.run(input)).rejects.toThrow();
  });
});
