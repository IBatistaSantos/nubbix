import { describe, it, expect } from "bun:test";
import { z } from "zod";
import { createZodValidator } from "../../src/utils/createZodValidator";
import { ValidationError } from "../../src/errors/ValidationError";

describe("createZodValidator", () => {
  it("should validate valid input", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const validator = createZodValidator(schema);
    const input = {
      name: "John",
      age: 30,
    };

    const result = validator.validate(input);

    expect(result).toEqual(input);
  });

  it("should throw ValidationError for invalid input", () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().int().positive(),
    });

    const validator = createZodValidator(schema);
    const invalidInput = {
      name: "",
      age: -5,
    };

    expect(() => validator.validate(invalidInput)).toThrow(ValidationError);
  });

  it("should include error details in ValidationError", () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().int().positive(),
    });

    const validator = createZodValidator(schema);
    const invalidInput = {
      name: "",
      age: -5,
    };

    try {
      validator.validate(invalidInput);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.details.length).toBeGreaterThan(0);
        expect(error.details[0]).toHaveProperty("path");
        expect(error.details[0]).toHaveProperty("message");
      }
    }
  });

  it("should handle nested validation errors", () => {
    const schema = z.object({
      user: z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    });

    const validator = createZodValidator(schema);
    const invalidInput = {
      user: {
        name: "",
        email: "invalid-email",
      },
    };

    try {
      validator.validate(invalidInput);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.message).toContain("Validation failed");
        expect(error.details.some((d) => d.path.includes("user"))).toBe(true);
      }
    }
  });

  it("should handle root level validation errors", () => {
    const schema = z.string().min(5);

    const validator = createZodValidator(schema);

    try {
      validator.validate("abc");
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.details[0].path).toBe("root");
      }
    }
  });
});
