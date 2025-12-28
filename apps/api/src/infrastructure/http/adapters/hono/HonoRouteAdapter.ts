import { Hono } from "hono";
import { RouteDefinition } from "../../../../shared/presentation/http/interfaces/RouteDefinition";
import { HttpHandler } from "../../../../shared/presentation/http/interfaces/HttpRequest";
import { adaptHonoRequest } from "./HonoRequestAdapter";
import { adaptHonoResponse } from "./HonoResponseAdapter";

export function registerHonoRoute(app: Hono, route: RouteDefinition): void {
  const handler = createHonoHandler(route.handler);

  switch (route.method) {
    case "GET":
      app.get(route.path, handler);
      break;
    case "POST":
      app.post(route.path, handler);
      break;
    case "PUT":
      app.put(route.path, handler);
      break;
    case "PATCH":
      app.patch(route.path, handler);
      break;
    case "DELETE":
      app.delete(route.path, handler);
      break;
  }
}

function createHonoHandler(httpHandler: HttpHandler) {
  return async (c: any) => {
    const request = await adaptHonoRequest(c);
    const response = await httpHandler(request);
    return adaptHonoResponse(c, response);
  };
}

export function registerHonoRoutes(app: Hono, routes: RouteDefinition[]): void {
  routes.forEach((route) => registerHonoRoute(app, route));
}
