import { RouteDefinition } from "../interfaces/RouteDefinition";
import { ModuleRoutes } from "../interfaces/ModuleRoutes";

export class ModuleRegistry {
  private modules: Map<string, ModuleRoutes> = new Map();
  private routeCache: RouteDefinition[] | null = null;

  register(moduleName: string, module: ModuleRoutes): void {
    if (this.modules.has(moduleName)) {
      throw new Error(`Module '${moduleName}' is already registered`);
    }
    this.modules.set(moduleName, module);
    this.routeCache = null;
  }

  getAllRoutes(): RouteDefinition[] {
    if (this.routeCache) {
      return this.routeCache;
    }

    const allRoutes: RouteDefinition[] = [];
    const routeMap = new Map<string, RouteDefinition>();

    for (const [moduleName, module] of this.modules.entries()) {
      const routes = module.getRoutes();

      for (const route of routes) {
        const routeKey = `${route.method}:${route.path}`;

        if (routeMap.has(routeKey)) {
          throw new Error(
            `Duplicate route detected: ${route.method} ${route.path}\n` +
              `  - Already registered in module\n` +
              `  - Attempted to register in module '${moduleName}'`
          );
        }

        routeMap.set(routeKey, route);
        allRoutes.push(route);
      }
    }

    this.routeCache = allRoutes;
    return allRoutes;
  }

  getRegisteredModules(): string[] {
    return Array.from(this.modules.keys());
  }

  clear(): void {
    this.modules.clear();
    this.routeCache = null;
  }
}
