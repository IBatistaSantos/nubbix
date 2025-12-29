import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { EventDate } from "../vo/EventDate";
import { ValidationError, ID } from "@nubbix/domain";

describe("EventDate", () => {
  describe("create", () => {
    it("should create a valid event date", () => {
      const dateId = faker.string.uuid();
      const date = faker.date.future().toISOString().split("T")[0];
      const startHour = faker.number.int({ min: 8, max: 18 });
      const startMinute = faker.helpers.arrayElement([0, 15, 30, 45]);
      const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
      const maxEndHour = Math.min(23, startHour + faker.number.int({ min: 1, max: 4 }));
      const endMinute = faker.helpers.arrayElement([0, 15, 30, 45]);
      const endTime = `${maxEndHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

      const eventDate = EventDate.create({
        id: dateId,
        date,
        startTime,
        endTime,
        finished: false,
        finishedAt: null,
      });

      expect(eventDate.id.value).toBe(dateId);
      expect(eventDate.date).toBe(date);
      expect(eventDate.startTime).toBe(startTime);
      expect(eventDate.endTime).toBe(endTime);
      expect(eventDate.finished).toBe(false);
      expect(eventDate.finishedAt).toBeNull();
    });

    it("should create event date with auto-generated ID when id is not provided", () => {
      const date = faker.date.future().toISOString().split("T")[0];
      const startTime = "10:00";
      const endTime = "12:00";

      const eventDate = EventDate.create({
        date,
        startTime,
        endTime,
        finished: false,
        finishedAt: null,
      });

      expect(eventDate.id).toBeInstanceOf(ID);
      expect(eventDate.id.value).toBeDefined();
    });

    it("should throw ValidationError when date format is invalid", () => {
      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "01-01-2025",
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when startTime format is invalid", () => {
      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "2025-01-01",
          startTime: "10:0",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when endTime format is invalid", () => {
      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "2025-01-01",
          startTime: "10:00",
          endTime: "25:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when startTime >= endTime", () => {
      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "2025-01-01",
          startTime: "12:00",
          endTime: "10:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);

      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "2025-01-01",
          startTime: "10:00",
          endTime: "10:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when finished is true but finishedAt is null", () => {
      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "2025-01-01",
          startTime: "10:00",
          endTime: "12:00",
          finished: true,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when finished is false but finishedAt is not null", () => {
      expect(() => {
        EventDate.create({
          id: "date_01",
          date: "2025-01-01",
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: "2025-01-01T12:00:00.000Z",
        });
      }).toThrow(ValidationError);
    });

    it("should create finished date with finishedAt", () => {
      const dateId = faker.string.uuid();
      const date = faker.date.past().toISOString().split("T")[0];
      const startTime = "10:00";
      const endTime = "12:00";
      const finishedAt = faker.date.past().toISOString();

      const eventDate = EventDate.create({
        id: dateId,
        date,
        startTime,
        endTime,
        finished: true,
        finishedAt,
      });

      expect(eventDate.finished).toBe(true);
      expect(eventDate.finishedAt).toBe(finishedAt);
    });
  });

  describe("finish", () => {
    it("should finish an unfinished date", () => {
      const dateId = faker.string.uuid();
      const date = faker.date.future().toISOString().split("T")[0];
      const startTime = "10:00";
      const endTime = "12:00";

      const eventDate = EventDate.create({
        id: dateId,
        date,
        startTime,
        endTime,
        finished: false,
        finishedAt: null,
      });

      const finishedDate = eventDate.finish();
      expect(finishedDate.finished).toBe(true);
      expect(finishedDate.finishedAt).toBeDefined();
      expect(finishedDate.finishedAt).not.toBeNull();
    });

    it("should throw ValidationError when trying to finish an already finished date", () => {
      const dateId = faker.string.uuid();
      const date = faker.date.past().toISOString().split("T")[0];
      const startTime = "10:00";
      const endTime = "12:00";
      const finishedAt = faker.date.past().toISOString();

      const eventDate = EventDate.create({
        id: dateId,
        date,
        startTime,
        endTime,
        finished: true,
        finishedAt,
      });

      expect(() => eventDate.finish()).toThrow(ValidationError);
    });
  });

  describe("toJSON", () => {
    it("should return JSON representation", () => {
      const dateId = faker.string.uuid();
      const date = faker.date.future().toISOString().split("T")[0];
      const startTime = "10:00";
      const endTime = "12:00";

      const eventDate = EventDate.create({
        id: dateId,
        date,
        startTime,
        endTime,
        finished: false,
        finishedAt: null,
      });

      const json = eventDate.toJSON();
      expect(json).toEqual({
        id: dateId,
        date,
        startTime,
        endTime,
        finished: false,
        finishedAt: null,
      });
    });
  });
});
