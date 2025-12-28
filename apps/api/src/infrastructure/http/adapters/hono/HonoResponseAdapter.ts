import { Context } from "hono";
import { HttpResponse } from "../../../../shared/presentation/http/interfaces/HttpRequest";

export function adaptHonoResponse(c: Context, response: HttpResponse): Response {
  return c.json(response.data, response.status as any);
}
