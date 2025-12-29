import { describe, it, expect } from "bun:test";
import { EventType, EventTypeValue } from "../vo/EventType";

describe("EventType", () => {
  describe("static methods", () => {
    it("should create digital event type", () => {
      const eventType = EventType.digital();
      expect(eventType.value).toBe(EventTypeValue.DIGITAL);
      expect(eventType.isDigital()).toBe(true);
      expect(eventType.isHybrid()).toBe(false);
      expect(eventType.isInPerson()).toBe(false);
    });

    it("should create hybrid event type", () => {
      const eventType = EventType.hybrid();
      expect(eventType.value).toBe(EventTypeValue.HYBRID);
      expect(eventType.isDigital()).toBe(false);
      expect(eventType.isHybrid()).toBe(true);
      expect(eventType.isInPerson()).toBe(false);
    });

    it("should create in-person event type", () => {
      const eventType = EventType.inPerson();
      expect(eventType.value).toBe(EventTypeValue.IN_PERSON);
      expect(eventType.isDigital()).toBe(false);
      expect(eventType.isHybrid()).toBe(false);
      expect(eventType.isInPerson()).toBe(true);
    });

    it("should create from value", () => {
      const digital = EventType.fromValue(EventTypeValue.DIGITAL);
      const hybrid = EventType.fromValue(EventTypeValue.HYBRID);
      const inPerson = EventType.fromValue(EventTypeValue.IN_PERSON);

      expect(digital.value).toBe(EventTypeValue.DIGITAL);
      expect(hybrid.value).toBe(EventTypeValue.HYBRID);
      expect(inPerson.value).toBe(EventTypeValue.IN_PERSON);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal event types", () => {
      const type1 = EventType.digital();
      const type2 = EventType.digital();
      expect(type1.isEqualTo(type2)).toBe(true);
    });

    it("should return false for different event types", () => {
      const type1 = EventType.digital();
      const type2 = EventType.hybrid();
      expect(type1.isEqualTo(type2)).toBe(false);
    });
  });
});
