import { Context } from "hono";
import { HttpRequest } from "../../../../shared/presentation/http/interfaces/HttpRequest";

export async function adaptHonoRequest(c: Context): Promise<HttpRequest & { context: Context }> {
  let body: unknown = {};

  try {
    const contentType = c.req.header("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await c.req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      body = await c.req.parseBody();
    }
  } catch {
    body = {};
  }

  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    body,
    query: c.req.query() as Record<string, string>,
    params: c.req.param() as Record<string, string>,
    headers,
    context: c,
  };
}
