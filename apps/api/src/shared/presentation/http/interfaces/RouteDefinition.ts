import { HttpHandler } from "./HttpRequest";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: HttpHandler;
}

export interface RouteRegistry {
  register(route: RouteDefinition): void;
  getRoutes(): RouteDefinition[];
}
