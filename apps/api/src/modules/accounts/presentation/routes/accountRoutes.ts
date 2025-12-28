import { RouteDefinition, ModuleRoutes } from "../../../../shared/presentation/http/interfaces";
import { createAccountController } from "../controllers/CreateAccountController";

export class AccountRoutes implements ModuleRoutes {
  getRoutes(): RouteDefinition[] {
    return [
      {
        method: "POST",
        path: "/accounts",
        handler: createAccountController,
      },
    ];
  }
}

export const accountRoutes = new AccountRoutes();
