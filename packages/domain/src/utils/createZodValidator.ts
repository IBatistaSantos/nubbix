import { z } from "zod";
import { InputValidator } from "../usecase/InputValidator";
import { ValidationError } from "../errors/ValidationError";

export function createZodValidator<TInput>(
  schema: z.ZodSchema<TInput>
): InputValidator<TInput> {
  return {
    validate(input: unknown): TInput {
      try {
        return schema.parse(input);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.errors.map((e) => ({
            path: e.path.join(".") || "root",
            message: e.message,
          }));

          const message = `Validation failed: ${errors
            .map((e) => `${e.path}: ${e.message}`)
            .join(", ")}`;
          throw new ValidationError(message, errors);
        }
        throw error;
      }
    },
  };
}

