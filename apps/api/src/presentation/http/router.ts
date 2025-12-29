import { Hono } from "hono";
import { cors } from "hono/cors";
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

  app.use(
    "*",
    cors({
      origin: (origin) => {
        if (!origin) return origin;

        if (origin.includes("localhost:3000")) {
          return origin;
        }

        const baseDomain = process.env.BASE_DOMAIN;
        if (baseDomain) {
          if (origin === `https://${baseDomain}`) {
            return origin;
          }
        }

        const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || [];
        if (allowedOrigins.includes(origin)) {
          return origin;
        }

        return null;
      },
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

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
