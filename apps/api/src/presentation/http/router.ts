import { Hono } from "hono";
import { errorHandler } from "../../infrastructure/http/middleware/errorHandler";
import { ModuleRegistry } from "../../shared/presentation/http/core/ModuleRegistry";
import { registerHonoRoutes } from "../../infrastructure/http/adapters/hono/HonoRouteAdapter";
import { accountRoutes } from "../../modules/accounts/presentation/routes/accountRoutes";

const moduleRegistry = new ModuleRegistry();

moduleRegistry.register("accounts", accountRoutes);

export function createRouter(): Hono {
  const app = new Hono();

  app.onError(errorHandler);

  const v1 = new Hono();
  const allRoutes = moduleRegistry.getAllRoutes();
  registerHonoRoutes(v1, allRoutes);
  app.route("/v1", v1);

  return app;
}

export function getModuleRegistry(): ModuleRegistry {
  return moduleRegistry;
}
