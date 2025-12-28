import { describe, it, expect } from "bun:test";
import { Context } from "hono";
import { adaptHonoRequest } from "../HonoRequestAdapter";

describe("HonoRequestAdapter", () => {
  it("should extract JSON body from request", async () => {
    const mockContext = {
      req: {
        header: () => "application/json",
        json: async () => ({ name: "test", value: 123 }),
        query: () => ({}),
        param: () => ({}),
        raw: {
          headers: new Headers([["content-type", "application/json"]]),
        },
      },
    } as unknown as Context;

    const request = await adaptHonoRequest(mockContext);

    expect(request.body).toEqual({ name: "test", value: 123 });
  });

  it("should extract query parameters", async () => {
    const mockContext = {
      req: {
        header: () => "",
        json: async () => ({}),
        query: () => ({ page: "1", limit: "10" }),
        param: () => ({}),
        raw: {
          headers: new Headers(),
        },
      },
    } as unknown as Context;

    const request = await adaptHonoRequest(mockContext);

    expect(request.query).toEqual({ page: "1", limit: "10" });
  });

  it("should extract path parameters", async () => {
    const mockContext = {
      req: {
        header: () => "",
        json: async () => ({}),
        query: () => ({}),
        param: () => ({ id: "123" }),
        raw: {
          headers: new Headers(),
        },
      },
    } as unknown as Context;

    const request = await adaptHonoRequest(mockContext);

    expect(request.params).toEqual({ id: "123" });
  });

  it("should extract headers", async () => {
    const mockContext = {
      req: {
        header: () => "",
        json: async () => ({}),
        query: () => ({}),
        param: () => ({}),
        raw: {
          headers: new Headers([
            ["authorization", "Bearer token"],
            ["content-type", "application/json"],
          ]),
        },
      },
    } as unknown as Context;

    const request = await adaptHonoRequest(mockContext);

    expect(request.headers.authorization).toBe("Bearer token");
    expect(request.headers["content-type"]).toBe("application/json");
  });

  it("should handle form-urlencoded body", async () => {
    const mockContext = {
      req: {
        header: () => "application/x-www-form-urlencoded",
        parseBody: async () => ({ field: "value" }),
        query: () => ({}),
        param: () => ({}),
        raw: {
          headers: new Headers(),
        },
      },
    } as unknown as Context;

    const request = await adaptHonoRequest(mockContext);

    expect(request.body).toEqual({ field: "value" });
  });

  it("should return empty object when body parsing fails", async () => {
    const mockContext = {
      req: {
        header: () => "application/json",
        json: async () => {
          throw new Error("Parse error");
        },
        query: () => ({}),
        param: () => ({}),
        raw: {
          headers: new Headers(),
        },
      },
    } as unknown as Context;

    const request = await adaptHonoRequest(mockContext);

    expect(request.body).toEqual({});
  });
});
