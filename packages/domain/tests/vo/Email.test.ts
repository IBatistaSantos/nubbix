import { describe, it, expect } from "bun:test";
import { Email } from "../../src/vo/Email";
import { ValidationError } from "../../src/errors/ValidationError";
import { faker } from "@faker-js/faker";

describe("Email", () => {
  describe("create", () => {
    it("should create an email with valid format", () => {
      const emailValue = faker.internet.email();
      const email = Email.create(emailValue);

      expect(email.value).toBe(emailValue.toLowerCase().trim());
    });

    it("should normalize email to lowercase", () => {
      const emailValue = "Test@Example.COM";
      const email = Email.create(emailValue);

      expect(email.value).toBe("test@example.com");
    });

    it("should trim whitespace from email", () => {
      const emailValue = "  test@example.com  ";
      const email = Email.create(emailValue);

      expect(email.value).toBe("test@example.com");
    });

    it("should throw ValidationError for empty email", () => {
      expect(() => {
        Email.create("");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for email with only whitespace", () => {
      expect(() => {
        Email.create("   ");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for invalid email format", () => {
      expect(() => {
        Email.create("invalid-email");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for email without @", () => {
      expect(() => {
        Email.create("invalidemail.com");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for email without domain", () => {
      expect(() => {
        Email.create("test@");
      }).toThrow(ValidationError);
    });

    it("should throw ValidationError for email without TLD", () => {
      expect(() => {
        Email.create("test@example");
      }).toThrow(ValidationError);
    });
  });

  describe("equals", () => {
    it("should return true for equal emails", () => {
      const email1 = Email.create("test@example.com");
      const email2 = Email.create("test@example.com");

      expect(email1.equals(email2)).toBe(true);
    });

    it("should return false for different emails", () => {
      const email1 = Email.create("test1@example.com");
      const email2 = Email.create("test2@example.com");

      expect(email1.equals(email2)).toBe(false);
    });

    it("should return true for emails with different case", () => {
      const email1 = Email.create("Test@Example.COM");
      const email2 = Email.create("test@example.com");

      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe("toString", () => {
    it("should return the email value as string", () => {
      const emailValue = faker.internet.email();
      const email = Email.create(emailValue);

      expect(email.toString()).toBe(emailValue.toLowerCase().trim());
    });
  });
});
