import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { Slug } from "../vo/Slug";
import { ValidationError } from "@nubbix/domain";

describe("Slug", () => {
  describe("create", () => {
    it("should create a slug with a valid value", () => {
      const value = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const slug = Slug.create(value);

      expect(slug.value).toBe(value);
    });

    it("should create a slug with only letters", () => {
      const value = faker.lorem.word();
      const slug = Slug.create(value);

      expect(slug.value).toBe(value);
    });

    it("should create a slug with numbers", () => {
      const value = `${faker.lorem.word()}${faker.number.int()}`;
      const slug = Slug.create(value);

      expect(slug.value).toBe(value);
    });

    it("should create a slug with hyphens", () => {
      const value = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const slug = Slug.create(value);

      expect(slug.value).toBe(value);
    });

    it("should create a slug with underscores", () => {
      const value = `${faker.lorem.word()}_${faker.lorem.word()}`;
      const slug = Slug.create(value);

      expect(slug.value).toBe(value);
    });

    it("should throw ValidationError for empty string", () => {
      expect(() => {
        Slug.create("");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for whitespace only", () => {
      expect(() => {
        Slug.create("   ");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for slug with spaces", () => {
      expect(() => {
        Slug.create(faker.lorem.sentence());
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for slug with special characters", () => {
      expect(() => {
        Slug.create(`${faker.lorem.word()}@${faker.lorem.word()}#${faker.lorem.word()}`);
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for slug with dots", () => {
      expect(() => {
        Slug.create("slug.with.dots");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for slug with slashes", () => {
      expect(() => {
        Slug.create("slug/with/slashes");
      }).toThrow(ValidationError);
    });
  });

  describe("equals", () => {
    it("should return true for equal slugs", () => {
      const value = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const slug1 = Slug.create(value);
      const slug2 = Slug.create(value);

      expect(slug1.equals(slug2)).toBe(true);
    });

    it("should return false for different slugs", () => {
      const slug1 = Slug.create(faker.helpers.slugify(faker.company.name()).toLowerCase());
      const slug2 = Slug.create(faker.helpers.slugify(faker.company.name()).toLowerCase());

      expect(slug1.equals(slug2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return the string value", () => {
      const value = faker.helpers.slugify(faker.company.name()).toLowerCase();
      const slug = Slug.create(value);

      expect(slug.toString()).toBe(value);
    });
  });
});

