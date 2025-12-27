import { describe, it, expect } from "bun:test";
import { ID } from "../../src/vo/ID";

describe("ID", () => {
  describe("create", () => {
    it("should create an ID with a provided value", () => {
      const value = "test-id-123";
      const id = ID.create(value);

      expect(id.value).toBe(value);
    });

    it("should create an ID without a value", () => {
      const id = ID.create();

      expect(id.value).toBeDefined();
      expect(typeof id.value).toBe("string");
      expect(id.value.length).toBeGreaterThan(0);
    });
  });

  describe("equals", () => {
    it("should return true for equal IDs", () => {
      const value = "test-id-123";
      const id1 = ID.create(value);
      const id2 = ID.create(value);

      expect(id1.equals(id2)).toBe(true);
    });

    it("should return false for different IDs", () => {
      const id1 = ID.create("id-1");
      const id2 = ID.create("id-2");

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return the string value", () => {
      const value = "test-id-123";
      const id = ID.create(value);

      expect(id.toString()).toBe(value);
    });
  });
});

