import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { Address } from "../vo/Address";
import { ValidationError } from "@nubbix/domain";

describe("Address", () => {
  describe("create", () => {
    it("should create a valid address", () => {
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

      expect(address.street).toBe(street);
      expect(address.city).toBe(city);
      expect(address.state).toBe(state);
      expect(address.zip).toBe(zip);
      expect(address.country).toBe(country);
    });

    it("should create address without zip", () => {
      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const state = faker.location.state({ abbreviated: true });
      const country = faker.location.country();

      const address = Address.create({
        street,
        city,
        state,
        country,
      });

      expect(address.zip).toBeNull();
    });

    it("should throw ValidationError when street is empty", () => {
      expect(() => {
        Address.create({
          street: "",
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          country: faker.location.country(),
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when city is empty", () => {
      expect(() => {
        Address.create({
          street: faker.location.streetAddress(),
          city: "",
          state: faker.location.state({ abbreviated: true }),
          country: faker.location.country(),
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when state is empty", () => {
      expect(() => {
        Address.create({
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: "",
          country: faker.location.country(),
        });
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError when country is empty", () => {
      expect(() => {
        Address.create({
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          country: "",
        });
      }).toThrow(ValidationError);
    });

    it("should accept null zip", () => {
      const street = faker.location.streetAddress();
      const city = faker.location.city();
      const state = faker.location.state({ abbreviated: true });
      const country = faker.location.country();

      const address = Address.create({
        street,
        city,
        state,
        zip: null,
        country,
      });

      expect(address.zip).toBeNull();
    });
  });

  describe("toJSON", () => {
    it("should return JSON representation", () => {
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

      const json = address.toJSON();
      expect(json).toEqual({
        street,
        city,
        state,
        zip,
        country,
      });
    });
  });
});
