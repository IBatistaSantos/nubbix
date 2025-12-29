import { Hono } from "hono";
import { errorHandler } from "../../infrastructure/http/middleware/errorHandler";
import { ModuleRegistry } from "../../shared/presentation/http/core/ModuleRegistry";
import { registerHonoRoutes } from "../../infrastructure/http/adapters/hono/HonoRouteAdapter";
import { accountRoutes } from "../../modules/accounts/presentation/routes/accountRoutes";
import { templateRoutes } from "../../modules/notifications/presentation/routes/templateRoutes";
import { authRoutes } from "../../modules/identity/presentation/routes/authRoutes";

const moduleRegistry = new ModuleRegistry();

moduleRegistry.register("accounts", accountRoutes);
moduleRegistry.register("templates", templateRoutes);
moduleRegistry.register("auth", authRoutes);

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
