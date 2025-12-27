import { describe, it, expect } from "bun:test";
import { Status, StatusValue } from "../../src/vo/Status";

describe("Status", () => {
  describe("active", () => {
    it("should create an active status", () => {
      const status = Status.active();

      expect(status.value).toBe(StatusValue.ACTIVE);
      expect(status.isActive()).toBe(true);
      expect(status.isInactive()).toBe(false);
    });
  });

  describe("inactive", () => {
    it("should create an inactive status", () => {
      const status = Status.inactive();

      expect(status.value).toBe(StatusValue.INACTIVE);
      expect(status.isActive()).toBe(false);
      expect(status.isInactive()).toBe(true);
    });
  });

  describe("equals", () => {
    it("should return true for equal statuses", () => {
      const status1 = Status.active();
      const status2 = Status.active();

      expect(status1.equals(status2)).toBe(true);
    });

    it("should return false for different statuses", () => {
      const status1 = Status.active();
      const status2 = Status.inactive();

      expect(status1.equals(status2)).toBe(false);
    });
  });
});
