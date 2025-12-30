import { apiClient, clearAuthTokenCache } from "./apiClient";
import { setAuthToken, clearAuthToken } from "../actions/authActions";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    accountId: string;
    role: string;
    avatar: string | null;
  };
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordOutput {
  message: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ResetPasswordOutput {
  userId: string;
  email: string;
}

export interface SetPasswordInput {
  token: string;
  password: string;
}

export interface SetPasswordOutput {
  userId: string;
  email: string;
}

export const authApi = {
  async login(input: LoginInput, accountSlug: string): Promise<LoginOutput> {
    const response = await apiClient<LoginOutput>("/auth/login", {
      method: "POST",
      body: {
        ...input,
        accountSlug,
      },
    });

    if (response.accessToken) {
      await setAuthToken(response.accessToken);
      clearAuthTokenCache();
    }

    return response;
  },

  async forgotPassword(
    input: ForgotPasswordInput,
    accountSlug: string
  ): Promise<ForgotPasswordOutput> {
    return apiClient<ForgotPasswordOutput>("/auth/forgot-password", {
      method: "POST",
      body: {
        ...input,
        accountSlug,
      },
    });
  },

  async resetPassword(
    input: ResetPasswordInput,
    accountSlug: string
  ): Promise<ResetPasswordOutput> {
    return apiClient<ResetPasswordOutput>("/auth/reset-password", {
      method: "POST",
      body: {
        ...input,
        accountSlug,
      },
    });
  },

  async setPassword(input: SetPasswordInput): Promise<SetPasswordOutput> {
    return apiClient<SetPasswordOutput>("/accounts/set-password", {
      method: "POST",
      body: {
        token: input.token,
        password: input.password,
      },
    });
  },

  async logout(): Promise<void> {
    await clearAuthToken();
    clearAuthTokenCache();
  },
};
