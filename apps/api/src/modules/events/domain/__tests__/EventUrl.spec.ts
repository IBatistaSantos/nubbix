import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { EventUrl } from "../vo/EventUrl";
import { ValidationError } from "@nubbix/domain";

describe("EventUrl", () => {
  describe("create", () => {
    it("should create a valid event URL", () => {
      const urlValue = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
      const url = EventUrl.create(urlValue);
      expect(url.value).toBe(urlValue);
    });

    it("should throw ValidationError when URL is empty", () => {
      expect(() => {
        EventUrl.create("");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when URL contains spaces", () => {
      const urlWithSpaces = faker.lorem.words(3);
      expect(() => {
        EventUrl.create(urlWithSpaces);
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when URL contains invalid characters", () => {
      expect(() => {
        EventUrl.create("event@name");
      }).toThrow(ValidationError);

      expect(() => {
        EventUrl.create("event.name");
      }).toThrow(ValidationError);
    });

    it("should accept URLs with hyphens and underscores", () => {
      const url1Value = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
      const url2Value = faker.string.alphanumeric(10).toLowerCase();
      const url3Value = `${faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase()}_${faker.number.int({ min: 100, max: 999 })}`;

      const url1 = EventUrl.create(url1Value);
      const url2 = EventUrl.create(url2Value);
      const url3 = EventUrl.create(url3Value);

      expect(url1.value).toBe(url1Value);
      expect(url2.value).toBe(url2Value);
      expect(url3.value).toBe(url3Value);
    });
  });

  describe("equals", () => {
    it("should return true for equal URLs", () => {
      const urlValue = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
      const url1 = EventUrl.create(urlValue);
      const url2 = EventUrl.create(urlValue);
      expect(url1.equals(url2)).toBe(true);
    });

    it("should return false for different URLs", () => {
      const url1Value = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
      const url2Value = faker.helpers.slugify(faker.company.catchPhrase()).toLowerCase();
      const url1 = EventUrl.create(url1Value);
      const url2 = EventUrl.create(url2Value);
      expect(url1.equals(url2)).toBe(false);
    });
  });
});
