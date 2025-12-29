import { authApi } from "../../../../shared/http/authApi";
import type {
  LoginInput,
  LoginOutput,
  ForgotPasswordInput,
  ForgotPasswordOutput,
  ResetPasswordInput,
  ResetPasswordOutput,
} from "../dtos";
import type { SetPasswordInput, SetPasswordOutput } from "../dtos/SetPasswordDTO";

export class AuthService {
  async login(input: LoginInput, accountSlug: string): Promise<LoginOutput> {
    return authApi.login(input, accountSlug);
  }

  async forgotPassword(
    input: ForgotPasswordInput,
    accountSlug: string
  ): Promise<ForgotPasswordOutput> {
    return authApi.forgotPassword(input, accountSlug);
  }

  async resetPassword(
    input: ResetPasswordInput,
    accountSlug: string
  ): Promise<ResetPasswordOutput> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...resetInput } = input;
    return authApi.resetPassword(resetInput, accountSlug);
  }

  async setPassword(input: SetPasswordInput): Promise<SetPasswordOutput> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...setPasswordInput } = input;
    return authApi.setPassword(setPasswordInput);
  }

  async logout(): Promise<void> {
    return authApi.logout();
  }
}

export const authService = new AuthService();
