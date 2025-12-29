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
  async login(input: LoginInput): Promise<LoginOutput> {
    return authApi.login(input);
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    return authApi.forgotPassword(input);
  }

  async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordOutput> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...resetInput } = input;
    return authApi.resetPassword(resetInput);
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
