import { RouteDefinition, ModuleRoutes } from "../../../../shared/presentation/http/interfaces";
import { loginController } from "../controllers/LoginController";
import { forgotPasswordController } from "../controllers/ForgotPasswordController";
import { resetPasswordController } from "../controllers/ResetPasswordController";

export class AuthRoutes implements ModuleRoutes {
  getRoutes(): RouteDefinition[] {
    return [
      {
        method: "POST",
        path: "/auth/login",
        handler: loginController,
      },
      {
        method: "POST",
        path: "/auth/forgot-password",
        handler: forgotPasswordController,
      },
      {
        method: "POST",
        path: "/auth/reset-password",
        handler: resetPasswordController,
      },
    ];
  }
}

export const authRoutes = new AuthRoutes();
