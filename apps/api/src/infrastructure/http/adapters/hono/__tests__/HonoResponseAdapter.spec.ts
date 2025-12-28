import { describe, it, expect } from "bun:test";
import { Context } from "hono";
import { adaptHonoResponse } from "../HonoResponseAdapter";
import { HttpResponse } from "../../../../../shared/presentation/http/interfaces/HttpRequest";

describe("HonoResponseAdapter", () => {
  it("should convert HttpResponse to Hono Response with correct status", async () => {
    const mockContext = {
      json: (data: any, status: any) => {
        return new Response(JSON.stringify(data), { status });
      },
    } as unknown as Context;

    const httpResponse: HttpResponse = {
      status: 201,
      data: { id: "123", name: "test" },
    };

    const response = adaptHonoResponse(mockContext, httpResponse);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual({ id: "123", name: "test" });
  });

  it("should handle different status codes", () => {
    const mockContext = {
      json: (data: any, status: any) => {
        return new Response(JSON.stringify(data), { status });
      },
    } as unknown as Context;

    const statusCodes = [200, 201, 400, 404, 500];

    for (const status of statusCodes) {
      const httpResponse: HttpResponse = {
        status,
        data: { message: "test" },
      };

      const response = adaptHonoResponse(mockContext, httpResponse);
      expect(response.status).toBe(status);
    }
  });

  it("should serialize complex data structures", async () => {
    const mockContext = {
      json: (data: any, status: any) => {
        return new Response(JSON.stringify(data), { status });
      },
    } as unknown as Context;

    const complexData = {
      nested: {
        array: [1, 2, 3],
        object: { key: "value" },
      },
    };

    const httpResponse: HttpResponse = {
      status: 200,
      data: complexData,
    };

    const response = adaptHonoResponse(mockContext, httpResponse);
    const json = await response.json();

    expect(json).toEqual(complexData);
  });
});
