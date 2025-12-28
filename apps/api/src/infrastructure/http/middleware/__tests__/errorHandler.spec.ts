import { describe, it, expect, mock, beforeEach } from "bun:test";
import { Context } from "hono";
import { errorHandler } from "../errorHandler";
import { BadRequestError, ConflictError } from "../../../../shared/errors";
import { ValidationError } from "@nubbix/domain";
import { z } from "zod";

describe("errorHandler", () => {
  let mockContext: Context;

  beforeEach(() => {
    mockContext = {
      json: (data: any, status: any) => {
        return new Response(JSON.stringify(data), { status });
      },
    } as unknown as Context;
  });

  describe("AppError handling", () => {
    it("should handle AppError with errors array", async () => {
      const error = new BadRequestError("Validation failed", undefined, [
        { path: "email", message: "Invalid email" },
      ]);

      const response = errorHandler(error, mockContext) as Response;
      expect(response).toBeInstanceOf(Response);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.statusCode).toBe(400);
      expect(json.message).toBeDefined();
    });

    it("should handle ConflictError", async () => {
      const error = new ConflictError("Resource already exists");

      const response = errorHandler(error, mockContext) as Response;
      expect(response).toBeInstanceOf(Response);
      const json = await response.json();

      expect(response.status).toBe(409);
      expect(json.statusCode).toBe(409);
      expect(json.message).toContain("Resource already exists");
    });
  });

  describe("ValidationError handling", () => {
    it("should convert ValidationError to 400 response", async () => {
      const error = new ValidationError("Validation failed", [
        { path: "email", message: "Invalid email format" },
      ]);

      const response = errorHandler(error, mockContext) as Response;
      expect(response).toBeInstanceOf(Response);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.statusCode).toBe(400);
      expect(json.message).toBe("Invalid email format");
    });

    it("should handle multiple validation errors", async () => {
      const error = new ValidationError("Multiple errors", [
        { path: "email", message: "Invalid email" },
        { path: "name", message: "Name required" },
      ]);

      const response = errorHandler(error, mockContext) as Response;
      expect(response).toBeInstanceOf(Response);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.statusCode).toBe(400);
    });
  });

  describe("ZodError handling", () => {
    it("should convert ZodError to 400 response", async () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
      });

      try {
        schema.parse({ email: "invalid", name: "" });
      } catch (error) {
        const response = errorHandler(error as Error, mockContext) as Response;
        expect(response).toBeInstanceOf(Response);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.statusCode).toBe(400);
        expect(json.error).toBe("Bad Request");
      }
    });

    it("should improve generic Zod error messages", async () => {
      const schema = z.object({
        field: z.string(),
      });

      try {
        schema.parse({});
      } catch (error) {
        const response = errorHandler(error as Error, mockContext) as Response;
        expect(response).toBeInstanceOf(Response);
        const json = await response.json();

        expect(response.status).toBe(400);
        expect(json.message).toContain("required");
      }
    });
  });

  describe("Generic Error handling", () => {
    it("should handle generic errors as 500", async () => {
      const error = new Error("Unexpected error");
      const consoleErrorSpy = mock(() => {});

      // eslint-disable-next-line no-console
      const originalConsoleError = console.error;
      // eslint-disable-next-line no-console
      console.error = consoleErrorSpy;

      const response = errorHandler(error, mockContext) as Response;
      expect(response).toBeInstanceOf(Response);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.statusCode).toBe(500);
      expect(json.message).toBe("Internal server error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      // eslint-disable-next-line no-console
      console.error = originalConsoleError;
    });
  });
});
