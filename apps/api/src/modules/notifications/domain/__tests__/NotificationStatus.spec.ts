import { describe, it, expect } from "bun:test";
import { NotificationStatus, NotificationStatusValue } from "../vo/NotificationStatus";

describe("NotificationStatus", () => {
  describe("pending", () => {
    it("should create a pending status", () => {
      const status = NotificationStatus.pending();

      expect(status.value).toBe(NotificationStatusValue.PENDING);
      expect(status.isPending()).toBe(true);
      expect(status.isSent()).toBe(false);
      expect(status.isFailed()).toBe(false);
    });
  });

  describe("sent", () => {
    it("should create a sent status", () => {
      const status = NotificationStatus.sent();

      expect(status.value).toBe(NotificationStatusValue.SENT);
      expect(status.isSent()).toBe(true);
      expect(status.isPending()).toBe(false);
      expect(status.isFailed()).toBe(false);
    });
  });

  describe("failed", () => {
    it("should create a failed status", () => {
      const status = NotificationStatus.failed();

      expect(status.value).toBe(NotificationStatusValue.FAILED);
      expect(status.isFailed()).toBe(true);
      expect(status.isPending()).toBe(false);
      expect(status.isSent()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create status from PENDING value", () => {
      const status = NotificationStatus.fromValue(NotificationStatusValue.PENDING);

      expect(status.value).toBe(NotificationStatusValue.PENDING);
      expect(status.isPending()).toBe(true);
    });

    it("should create status from SENT value", () => {
      const status = NotificationStatus.fromValue(NotificationStatusValue.SENT);

      expect(status.value).toBe(NotificationStatusValue.SENT);
      expect(status.isSent()).toBe(true);
    });

    it("should create status from FAILED value", () => {
      const status = NotificationStatus.fromValue(NotificationStatusValue.FAILED);

      expect(status.value).toBe(NotificationStatusValue.FAILED);
      expect(status.isFailed()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal statuses", () => {
      const status1 = NotificationStatus.pending();
      const status2 = NotificationStatus.pending();

      expect(status1.isEqualTo(status2)).toBe(true);
    });

    it("should return false for different statuses", () => {
      const status1 = NotificationStatus.pending();
      const status2 = NotificationStatus.sent();

      expect(status1.isEqualTo(status2)).toBe(false);
    });
  });

  describe("isPending", () => {
    it("should return true for pending status", () => {
      const status = NotificationStatus.pending();

      expect(status.isPending()).toBe(true);
    });

    it("should return false for other statuses", () => {
      const status = NotificationStatus.sent();

      expect(status.isPending()).toBe(false);
    });
  });

  describe("isSent", () => {
    it("should return true for sent status", () => {
      const status = NotificationStatus.sent();

      expect(status.isSent()).toBe(true);
    });

    it("should return false for other statuses", () => {
      const status = NotificationStatus.pending();

      expect(status.isSent()).toBe(false);
    });
  });

  describe("isFailed", () => {
    it("should return true for failed status", () => {
      const status = NotificationStatus.failed();

      expect(status.isFailed()).toBe(true);
    });

    it("should return false for other statuses", () => {
      const status = NotificationStatus.pending();

      expect(status.isFailed()).toBe(false);
    });
  });
});
