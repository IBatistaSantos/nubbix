import { describe, it, expect } from "bun:test";
import { BaseUseCase } from "../../src/usecase/BaseUseCase";
import { InputValidator } from "../../src/usecase/InputValidator";
import { ValidationError } from "../../src/errors/ValidationError";
import { z } from "zod";

interface TestInput {
  name: string;
  age: number;
}

interface TestOutput {
  message: string;
}

class TestUseCase extends BaseUseCase<TestInput, TestOutput> {
  protected getInputValidator(): InputValidator<TestInput> {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().int().positive(),
    });

    return {
      validate(input: unknown): TestInput {
        return schema.parse(input);
      },
    };
  }

  protected async execute(input: TestInput): Promise<TestOutput> {
    return {
      message: `Hello ${input.name}, you are ${input.age} years old`,
    };
  }
}

class FailingValidatorUseCase extends BaseUseCase<TestInput, TestOutput> {
  protected getInputValidator(): InputValidator<TestInput> {
    return {
      validate(_input: unknown): TestInput {
        throw new ValidationError("Validation failed", [
          { path: "name", message: "Name is required" },
        ]);
      },
    };
  }

  protected async execute(_input: TestInput): Promise<TestOutput> {
    return { message: "Success" };
  }
}

describe("BaseUseCase", () => {
  describe("run", () => {
    it("should validate input and execute use case", async () => {
      const useCase = new TestUseCase();
      const input = {
        name: "John",
        age: 30,
      };

      const result = await useCase.run(input);

      expect(result).toEqual({
        message: "Hello John, you are 30 years old",
      });
    });

    it("should throw ValidationError for invalid input", async () => {
      const useCase = new TestUseCase();
      const invalidInput = {
        name: "",
        age: -5,
      };

      await expect(useCase.run(invalidInput)).rejects.toThrow();
    });

    it("should throw ValidationError when validator throws", async () => {
      const useCase = new FailingValidatorUseCase();

      await expect(useCase.run({ name: "John", age: 30 })).rejects.toThrow(ValidationError);
    });

    it("should handle missing required fields", async () => {
      const useCase = new TestUseCase();

      await expect(useCase.run({ name: "John" } as any)).rejects.toThrow();
    });

    it("should handle wrong types", async () => {
      const useCase = new TestUseCase();

      await expect(useCase.run({ name: "John", age: "30" } as any)).rejects.toThrow();
    });
  });
});
