import { describe, it, expect } from "bun:test";
import { AttachmentType, AttachmentTypeValue } from "../vo/AttachmentType";

describe("AttachmentType", () => {
  describe("image", () => {
    it("should create an image attachment type", () => {
      const type = AttachmentType.image();

      expect(type.value).toBe(AttachmentTypeValue.IMAGE);
      expect(type.isImage()).toBe(true);
      expect(type.isFile()).toBe(false);
    });
  });

  describe("file", () => {
    it("should create a file attachment type", () => {
      const type = AttachmentType.file();

      expect(type.value).toBe(AttachmentTypeValue.FILE);
      expect(type.isFile()).toBe(true);
      expect(type.isImage()).toBe(false);
    });
  });

  describe("fromValue", () => {
    it("should create type from IMAGE value", () => {
      const type = AttachmentType.fromValue(AttachmentTypeValue.IMAGE);

      expect(type.value).toBe(AttachmentTypeValue.IMAGE);
      expect(type.isImage()).toBe(true);
    });

    it("should create type from FILE value", () => {
      const type = AttachmentType.fromValue(AttachmentTypeValue.FILE);

      expect(type.value).toBe(AttachmentTypeValue.FILE);
      expect(type.isFile()).toBe(true);
    });
  });

  describe("isEqualTo", () => {
    it("should return true for equal types", () => {
      const type1 = AttachmentType.image();
      const type2 = AttachmentType.image();

      expect(type1.isEqualTo(type2)).toBe(true);
    });

    it("should return false for different types", () => {
      const type1 = AttachmentType.image();
      const type2 = AttachmentType.file();

      expect(type1.isEqualTo(type2)).toBe(false);
    });
  });

  describe("isImage", () => {
    it("should return true for image type", () => {
      const type = AttachmentType.image();

      expect(type.isImage()).toBe(true);
    });

    it("should return false for file type", () => {
      const type = AttachmentType.file();

      expect(type.isImage()).toBe(false);
    });
  });

  describe("isFile", () => {
    it("should return true for file type", () => {
      const type = AttachmentType.file();

      expect(type.isFile()).toBe(true);
    });

    it("should return false for image type", () => {
      const type = AttachmentType.image();

      expect(type.isFile()).toBe(false);
    });
  });
});
