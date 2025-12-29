import { authApi } from "../../../../shared/http/authApi";
import type {
  LoginInput,
  LoginOutput,
  ForgotPasswordInput,
  ForgotPasswordOutput,
  ResetPasswordInput,
  ResetPasswordOutput,
} from "../dtos";

export class AuthService {
  async login(input: LoginInput): Promise<LoginOutput> {
    return authApi.login(input);
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    return authApi.forgotPassword(input);
  }

  async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    const { confirmPassword, ...resetInput } = input;
    return authApi.resetPassword(resetInput);
  }

  async logout(): Promise<void> {
    return authApi.logout();
  }
}

export const authService = new AuthService();
