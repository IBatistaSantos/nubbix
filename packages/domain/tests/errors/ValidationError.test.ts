import { describe, it, expect } from "bun:test";
import { ValidationError, ValidationErrorDetail } from "../../src/errors/ValidationError";

describe("ValidationError", () => {
  it("should create a ValidationError with message", () => {
    const error = new ValidationError("Test error");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("ValidationError");
    expect(error.details).toEqual([]);
  });

  it("should create a ValidationError with message and details", () => {
    const details: ValidationErrorDetail[] = [
      { path: "name", message: "Name is required" },
      { path: "age", message: "Age must be positive" },
    ];

    const error = new ValidationError("Validation failed", details);

    expect(error.message).toBe("Validation failed");
    expect(error.details).toEqual(details);
    expect(error.details.length).toBe(2);
  });

  it("should have correct prototype chain", () => {
    const error = new ValidationError("Test error");

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ValidationError).toBe(true);
  });

  it("should be throwable and catchable", () => {
    const error = new ValidationError("Test error");

    expect(() => {
      throw error;
    }).toThrow(ValidationError);

    try {
      throw error;
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as ValidationError).message).toBe("Test error");
    }
  });
});
