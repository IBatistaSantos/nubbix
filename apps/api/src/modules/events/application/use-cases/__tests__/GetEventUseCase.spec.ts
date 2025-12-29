import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { GetEventUseCase } from "../GetEventUseCase";
import { InMemoryEventRepository } from "./InMemoryEventRepository";
import { Event, EventDate } from "../../../domain";
import { ID } from "@nubbix/domain";
import { NotFoundError } from "../../../../../shared/errors";

describe("GetEventUseCase", () => {
  let useCase: GetEventUseCase;
  let eventRepository: InMemoryEventRepository;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    useCase = new GetEventUseCase(eventRepository);
  });

  it("should get event successfully", async () => {
    const event = Event.asFaker();
    await eventRepository.save(event);

    const output = await useCase.run(event.id.value);

    expect(output.id).toBe(event.id.value);
    expect(output.name).toBe(event.name);
    expect(output.dates.length).toBeGreaterThan(0);
  });

  it("should throw error when event not found", async () => {
    const eventId = ID.create().value;

    await expect(useCase.run(eventId)).rejects.toThrow(NotFoundError);
  });

  it("should return dates sorted with active dates first", async () => {
    const futureDate1 = faker.date.future().toISOString().split("T")[0];
    const futureDate2 = faker.date.future().toISOString().split("T")[0];
    const pastDate = faker.date.past().toISOString().split("T")[0];

    const event = Event.asFaker({
      dates: [
        EventDate.create({
          date: pastDate,
          startTime: "10:00",
          endTime: "12:00",
          finished: true,
          finishedAt: new Date().toISOString(),
        }),
        EventDate.create({
          date: futureDate2,
          startTime: "14:00",
          endTime: "16:00",
          finished: false,
          finishedAt: null,
        }),
        EventDate.create({
          date: futureDate1,
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        }),
      ],
    });
    await eventRepository.save(event);

    const output = await useCase.run(event.id.value);

    expect(output.dates.length).toBe(3);
    expect(output.dates[0].finished).toBe(false);
    expect(output.dates[1].finished).toBe(false);
    expect(output.dates[2].finished).toBe(true);
  });
});
