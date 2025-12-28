import { Context, ErrorHandler } from "hono";
import { z } from "zod";
import { ValidationError } from "@nubbix/domain";
import { AppError } from "../../../shared/errors";
import { errorResponse } from "../../../presentation/http/adapters/honoAdapter";

export const errorHandler: ErrorHandler = (error: Error, c: Context): Response => {
  if (error instanceof AppError) {
    const messages = error.errors.length > 0 ? error.errors.map((e) => e.message) : [error.message];

    return errorResponse(c, messages, error.statusCode, error.errors);
  }

  if (error instanceof ValidationError) {
    const mainMessage =
      error.details.length === 1 ? error.details[0].message : error.message || "Validation failed";

    return errorResponse(
      c,
      mainMessage,
      400,
      error.details.map((d) => ({
        path: d.path,
        message: d.message,
        code: "validation",
      }))
    );
  }

  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map((e) => {
      const path = e.path.join(".") || "root";
      let message = e.message;

      if (e.code === "invalid_type" && e.message === "Required") {
        message = `${path === "root" ? "This field" : `Field '${path}'`} is required`;
      } else if (e.code === "invalid_type") {
        message = `${path === "root" ? "This field" : `Field '${path}'`} must be ${e.expected || "valid"}`;
      }

      return {
        path,
        message,
        code: e.code,
      };
    });

    const mainMessage =
      formattedErrors.length === 1 ? formattedErrors[0].message : "Validation failed";

    return errorResponse(c, mainMessage, 400, formattedErrors);
  }

  // eslint-disable-next-line no-console
  console.error("Unhandled error:", error);
  return errorResponse(c, "Internal server error", 500);
};
