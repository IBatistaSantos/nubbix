import { RouteDefinition, ModuleRoutes } from "../../../../shared/presentation/http/interfaces";
import { createAccountController } from "../controllers/CreateAccountController";
import { setPasswordController } from "../controllers/SetPasswordController";
import { validateAccountSlugController } from "../controllers/ValidateAccountSlugController";

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
      {
        method: "GET",
        path: "/accounts/validate-slug",
        handler: validateAccountSlugController,
      },
    ];
  }
}

export const accountRoutes = new AccountRoutes();
