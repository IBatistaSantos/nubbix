import { RouteDefinition, ModuleRoutes } from "../../../../shared/presentation/http/interfaces";
import { createAccountController } from "../controllers/CreateAccountController";
import { setPasswordController } from "../controllers/SetPasswordController";

export class AccountRoutes implements ModuleRoutes {
  getRoutes(): RouteDefinition[] {
    return [
      {
        method: "POST",
        path: "/accounts",
        handler: createAccountController,
      },
      {
        method: "POST",
        path: "/accounts/set-password",
        handler: setPasswordController,
      },
    ];
  }
}

export const accountRoutes = new AccountRoutes();
