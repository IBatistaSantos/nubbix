import { HttpHandler } from "./HttpRequest";
import { MiddlewareHandler } from "hono";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: HttpHandler;
  middleware?: MiddlewareHandler[];
}

export interface RouteRegistry {
  register(route: RouteDefinition): void;
  getRoutes(): RouteDefinition[];
}
