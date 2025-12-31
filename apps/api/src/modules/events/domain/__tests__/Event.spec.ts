import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { Event } from "../Event";
import { EventType, Address, TicketSales, EventDate, TicketSalesStatusValue } from "../vo";
import { ID, ValidationError } from "@nubbix/domain";

describe("Event", () => {
  const accountId = ID.create().value;

  describe("constructor", () => {
    it("should create an event with default values", () => {
      const name = faker.company.catchPhrase();
      const description = faker.lorem.paragraph();
      const url = faker.helpers.slugify(name).toLowerCase();
      const date = faker.date.future().toISOString().split("T")[0];

      const event = new Event({
        accountId,
        name,
        description,
        type: EventType.digital(),
        url,
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            date,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.id).toBeInstanceOf(ID);
      expect(event.accountId).toBe(accountId);
      expect(event.name).toBe(name);
      expect(event.description).toBe(description);
      expect(event.type.isDigital()).toBe(true);
      expect(event.url.value).toBe(url);
      expect(event.address).toBeNull();
      expect(event.maxCapacity).toBeNull();
      expect(event.tags).toEqual([]);
      expect(event.dates).toHaveLength(1);
      expect(event.status.isActive()).toBe(true);
    });

    it("should create an event with all fields", () => {
      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const state = faker.location.state({ abbreviated: true });
      const zip = faker.location.zipCode();
      const country = faker.location.country();
      const address = Address.create({
        street,
        city,
        state,
        zip,
        country,
      });

      const name = faker.company.catchPhrase();
      const description = faker.lorem.paragraph();
      const url = faker.helpers.slugify(name).toLowerCase();
      const maxCapacity = faker.number.int({ min: 10, max: 1000 });
      const tags = faker.helpers.arrayElements(
        ["tech", "business", "networking", "education", "workshop"],
        { min: 2, max: 4 }
      );
      const date = faker.date.future().toISOString().split("T")[0];

      const event = new Event({
        accountId,
        name,
        description,
        type: EventType.inPerson(),
        url,
        address,
        maxCapacity,
        ticketSales: TicketSales.enabled(),
        tags,
        dates: [
          EventDate.create({
            date,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.address).toBeInstanceOf(Address);
      expect(event.maxCapacity).toBe(maxCapacity);
      expect(event.tags).toEqual(tags);
    });
  });

  describe("validate", () => {
    it("should pass validation for valid event", () => {
      const name = faker.company.catchPhrase();
      const description = faker.lorem.paragraph();
      const url = faker.helpers.slugify(name).toLowerCase();
      const date = faker.date.future().toISOString().split("T")[0];

      const event = new Event({
        accountId,
        name,
        description,
        type: EventType.digital(),
        url,
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            date,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).not.toThrow();
    });

    it("should throw ValidationError when accountId is empty", () => {
      const event = new Event({
        accountId: "",
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when name is empty", () => {
      const event = new Event({
        accountId,
        name: "",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when name exceeds 255 characters", () => {
      const longName = faker.string.alphanumeric(256);
      const description = faker.lorem.paragraph();
      const url = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
      const date = faker.date.future().toISOString().split("T")[0];

      const event = new Event({
        accountId,
        name: longName,
        description,
        type: EventType.digital(),
        url,
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            date,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when maxCapacity is not a positive integer", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        maxCapacity: -1,
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when tags exceed 30 items", () => {
      const tags = Array.from({ length: 31 }, () => faker.lorem.word());
      const name = faker.company.catchPhrase();
      const description = faker.lorem.paragraph();
      const url = faker.helpers.slugify(name).toLowerCase();
      const date = faker.date.future().toISOString().split("T")[0];

      const event = new Event({
        accountId,
        name,
        description,
        type: EventType.digital(),
        url,
        ticketSales: TicketSales.enabled(),
        tags,
        dates: [
          EventDate.create({
            date,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when tags contain duplicates", () => {
      const duplicateTag = faker.lorem.word();
      const name = faker.company.catchPhrase();
      const description = faker.lorem.paragraph();
      const url = faker.helpers.slugify(name).toLowerCase();
      const date = faker.date.future().toISOString().split("T")[0];

      const event = new Event({
        accountId,
        name,
        description,
        type: EventType.digital(),
        url,
        ticketSales: TicketSales.enabled(),
        tags: [duplicateTag, faker.lorem.word(), duplicateTag],
        dates: [
          EventDate.create({
            date,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when dates array is empty", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });

    it("should throw ValidationError when dates have duplicate (date, startTime, endTime)", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
          EventDate.create({
            id: "date_02",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => event.validate()).toThrow(ValidationError);
    });
  });

  describe("update", () => {
    let event: Event;

    beforeEach(() => {
      event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });
    });

    it("should update event name", () => {
      event.update({ name: "Updated Event" });
      expect(event.name).toBe("Updated Event");
    });

    it("should update event description", () => {
      event.update({ description: "Updated Description" });
      expect(event.description).toBe("Updated Description");
    });

    it("should update event type", () => {
      event.update({ type: EventType.hybrid() });
      expect(event.type.isHybrid()).toBe(true);
    });

    it("should update address", () => {
      const address = Address.create({
        street: "456 New St",
        city: "Newtown",
        state: "NY",
        country: "USA",
      });
      event.update({ address });
      expect(event.address).toBeInstanceOf(Address);
      expect(event.address?.street).toBe("456 New St");
    });

    it("should update maxCapacity", () => {
      event.update({ maxCapacity: 200 });
      expect(event.maxCapacity).toBe(200);
    });

    it("should set maxCapacity to null", () => {
      event.update({ maxCapacity: 100 });
      event.update({ maxCapacity: null });
      expect(event.maxCapacity).toBeNull();
    });

    it("should throw ValidationError when updating inactive event", () => {
      event.deactivate();
      expect(() => {
        event.update({ name: "Updated Event" });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when maxCapacity is invalid", () => {
      expect(() => {
        event.update({ maxCapacity: -1 });
      }).toThrow(ValidationError);

      expect(() => {
        event.update({ maxCapacity: 0 });
      }).toThrow(ValidationError);
    });

    it("should remove duplicate tags", () => {
      event.update({ tags: ["tech", "business", "tech"] });
      expect(event.tags).toEqual(["tech", "business"]);
    });

    it("should throw ValidationError when tags exceed 30 items", () => {
      const tags = Array.from({ length: 31 }, (_, i) => `tag${i}`);
      expect(() => {
        event.update({ tags });
      }).toThrow(ValidationError);
    });
  });

  describe("addDate", () => {
    let event: Event;
    let futureDate1: string;
    let futureDate2: string;

    beforeEach(() => {
      futureDate1 = faker.date.future().toISOString().split("T")[0];
      futureDate2 = faker.date.future({ years: 1 }).toISOString().split("T")[0];

      event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: futureDate1,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });
    });

    it("should add a new date", () => {
      event.addDate({
        id: "date_02",
        date: futureDate2,
        startTime: "14:00",
        endTime: "16:00",
        finished: false,
        finishedAt: null,
      });

      expect(event.dates).toHaveLength(2);
      expect(event.dates[1].id.value).toBe("date_02");
    });

    it("should throw ValidationError when adding duplicate (date, startTime, endTime)", () => {
      expect(() => {
        event.addDate({
          id: "date_02",
          date: futureDate1,
          startTime: "10:00",
          endTime: "12:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when adding date to inactive event", () => {
      event.deactivate();
      expect(() => {
        event.addDate({
          id: "date_02",
          date: futureDate2,
          startTime: "14:00",
          endTime: "16:00",
          finished: false,
          finishedAt: null,
        });
      }).toThrow(ValidationError);
    });
  });

  describe("updateDate", () => {
    let event: Event;
    let futureDate1: string;
    let futureDate2: string;

    beforeEach(() => {
      futureDate1 = faker.date.future().toISOString().split("T")[0];
      futureDate2 = faker.date.future({ years: 1 }).toISOString().split("T")[0];

      event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: futureDate1,
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });
    });

    it("should update date", () => {
      event.updateDate("date_01", {
        date: futureDate2,
        startTime: "14:00",
        endTime: "16:00",
      });

      expect(event.dates[0].date).toBe(futureDate2);
      expect(event.dates[0].startTime).toBe("14:00");
      expect(event.dates[0].endTime).toBe("16:00");
    });

    it("should throw ValidationError when updating non-existent date", () => {
      expect(() => {
        event.updateDate("date_99", {
          date: futureDate2,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when updating finished date", () => {
      event.finishDate("date_01");
      expect(() => {
        event.updateDate("date_01", {
          date: futureDate2,
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when updating to duplicate (date, startTime, endTime)", () => {
      event.addDate({
        id: "date_02",
        date: futureDate2,
        startTime: "14:00",
        endTime: "16:00",
        finished: false,
        finishedAt: null,
      });

      expect(() => {
        event.updateDate("date_01", {
          date: futureDate2,
          startTime: "14:00",
          endTime: "16:00",
        });
      }).toThrow(ValidationError);
    });
  });

  describe("removeDate", () => {
    let event: Event;

    beforeEach(() => {
      event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
          EventDate.create({
            id: "date_02",
            date: "2025-01-02",
            startTime: "14:00",
            endTime: "16:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });
    });

    it("should remove a date", () => {
      event.removeDate("date_01");
      expect(event.dates).toHaveLength(1);
      expect(event.dates[0].id.value).toBe("date_02");
    });

    it("should throw ValidationError when removing non-existent date", () => {
      expect(() => {
        event.removeDate("date_99");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when removing finished date", () => {
      event.finishDate("date_01");
      expect(() => {
        event.removeDate("date_01");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when removing last date", () => {
      const singleDateEvent = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(() => {
        singleDateEvent.removeDate("date_01");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when removing date from inactive event", () => {
      event.deactivate();
      expect(() => {
        event.removeDate("date_01");
      }).toThrow(ValidationError);
    });
  });

  describe("finishDate", () => {
    let event: Event;

    beforeEach(() => {
      event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });
    });

    it("should finish a date", () => {
      event.finishDate("date_01");
      expect(event.dates[0].finished).toBe(true);
      expect(event.dates[0].finishedAt).not.toBeNull();
    });

    it("should throw ValidationError when finishing non-existent date", () => {
      expect(() => {
        event.finishDate("date_99");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when finishing already finished date", () => {
      event.finishDate("date_01");
      expect(() => {
        event.finishDate("date_01");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when finishing date in inactive event", () => {
      event.deactivate();
      expect(() => {
        event.finishDate("date_01");
      }).toThrow(ValidationError);
    });
  });

  describe("canSellTickets", () => {
    it("should return true when event is active and ticket sales are open", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(TicketSalesStatusValue.OPEN),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.canSellTickets()).toBe(true);
    });

    it("should return false when event is inactive", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(TicketSalesStatusValue.OPEN),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      event.deactivate();
      expect(event.canSellTickets()).toBe(false);
    });

    it("should return false when ticket sales are disabled", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.disabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.canSellTickets()).toBe(false);
    });

    it("should return false when ticket sales status is closed", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(TicketSalesStatusValue.CLOSED),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.canSellTickets()).toBe(false);
    });
  });

  describe("hasUnlimitedCapacity", () => {
    it("should return true when maxCapacity is null", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.hasUnlimitedCapacity()).toBe(true);
    });

    it("should return false when maxCapacity is set", () => {
      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.digital(),
        url: "test-event",
        maxCapacity: 100,
        ticketSales: TicketSales.enabled(),
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      expect(event.hasUnlimitedCapacity()).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("should return JSON representation", () => {
      const address = Address.create({
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "USA",
      });

      const event = new Event({
        accountId,
        name: "Test Event",
        description: "Test Description",
        type: EventType.inPerson(),
        url: "test-event",
        address,
        maxCapacity: 100,
        ticketSales: TicketSales.enabled(),
        tags: ["tech", "business"],
        dates: [
          EventDate.create({
            id: "date_01",
            date: "2025-01-01",
            startTime: "10:00",
            endTime: "12:00",
            finished: false,
            finishedAt: null,
          }),
        ],
      });

      const json = event.toJSON();
      expect(json.accountId).toBe(accountId);
      expect(json.name).toBe("Test Event");
      expect(json.description).toBe("Test Description");
      expect(json.type).toBe("in-person");
      expect(json.url).toBe("test-event");
      expect(json.address).toBeDefined();
      expect(json.maxCapacity).toBe(100);
      expect(json.tags).toEqual(["tech", "business"]);
      expect(json.dates).toHaveLength(1);
    });
  });
});
