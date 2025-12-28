import { RouteDefinition } from "./RouteDefinition";

export interface ModuleRoutes {
  getRoutes(): RouteDefinition[];
}

export const MODULE_ROUTES_SYMBOL = Symbol("moduleRoutes");
