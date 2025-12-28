import { z } from "zod";
import { InputValidator } from "../usecase/InputValidator";
import { ValidationError } from "../errors/ValidationError";

export function createZodValidator<TInput>(schema: z.ZodSchema<TInput>): InputValidator<TInput> {
  return {
    validate(input: unknown): TInput {
      try {
        return schema.parse(input);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors = error.errors.map((e) => {
            const path = e.path.join(".") || "root";
            let message = e.message;

            // Melhorar mensagens genéricas do Zod
            if (e.code === "invalid_type" && e.message === "Required") {
              message = path === "root" ? "This field is required" : `Field '${path}' is required`;
            } else if (e.code === "invalid_type") {
              message =
                path === "root"
                  ? `This field must be ${e.expected || "valid"}`
                  : `Field '${path}' must be ${e.expected || "valid"}`;
            } else if (e.code === "too_small" && e.type === "string") {
              message = e.message || `Field '${path}' is too short`;
            } else if (e.code === "too_big" && e.type === "string") {
              message = e.message || `Field '${path}' is too long`;
            } else if (e.code === "invalid_string" && e.validation === "email") {
              message = `Field '${path}' must be a valid email address`;
            } else if (e.code === "invalid_string" && e.validation === "url") {
              message = `Field '${path}' must be a valid URL`;
            } else if (e.code === "invalid_enum_value") {
              message = e.message || `Field '${path}' has an invalid value`;
            }

            return {
              path,
              message,
            };
          });

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
