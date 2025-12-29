import { apiClient } from "./apiClient";
import { getAccountSlug } from "../utils/accountSlug";

export interface LoginInput {
  email: string;
  password: string;
  accountSlug: string;
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
  accountSlug: string;
}

export interface ForgotPasswordOutput {
  message: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  accountSlug: string;
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
  async login(input: Omit<LoginInput, "accountSlug">): Promise<LoginOutput> {
    const accountSlug = getAccountSlug();
    if (!accountSlug) {
      throw new Error("Account slug is required");
    }

    const response = await apiClient<LoginOutput>("/auth/login", {
      method: "POST",
      body: {
        ...input,
        accountSlug,
      },
    });

    if (response.accessToken) {
      await fetch("/api/auth/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.accessToken }),
      });
    }

    return response;
  },

  async forgotPassword(
    input: Omit<ForgotPasswordInput, "accountSlug">
  ): Promise<ForgotPasswordOutput> {
    const accountSlug = getAccountSlug();
    if (!accountSlug) {
      throw new Error("Account slug is required");
    }

    return apiClient<ForgotPasswordOutput>("/auth/forgot-password", {
      method: "POST",
      body: {
        ...input,
        accountSlug,
      },
    });
  },

  async resetPassword(
    input: Omit<ResetPasswordInput, "accountSlug">
  ): Promise<ResetPasswordOutput> {
    const accountSlug = getAccountSlug();
    if (!accountSlug) {
      throw new Error("Account slug is required");
    }

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
    await fetch("/api/auth/clear-token", {
      method: "POST",
    });
  },
};
