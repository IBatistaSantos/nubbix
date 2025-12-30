import { useCallback } from "react";
import { useAuthQuery } from "../queries/authQueries";
import {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../mutations/authMutations";
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput } from "../../application/dtos";

export function useAuthController(accountSlug?: string) {
  const { data: user, isLoading, isError } = useAuthQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const login = useCallback(
    async (input: LoginInput) => {
      if (!accountSlug) {
        throw new Error("Account slug is required for login");
      }
      return loginMutation.mutateAsync({ input, accountSlug });
    },
    [accountSlug, loginMutation]
  );

  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const forgotPassword = useCallback(
    async (input: ForgotPasswordInput) => {
      if (!accountSlug) {
        throw new Error("Account slug is required for forgot password");
      }
      return forgotPasswordMutation.mutateAsync({ input, accountSlug });
    },
    [accountSlug, forgotPasswordMutation]
  );

  const resetPassword = useCallback(
    async (input: ResetPasswordInput) => {
      if (!accountSlug) {
        throw new Error("Account slug is required for reset password");
      }
      return resetPasswordMutation.mutateAsync({ input, accountSlug });
    },
    [accountSlug, resetPasswordMutation]
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || loginMutation.isPending,
    isError,
    login,
    logout,
    forgotPassword,
    resetPassword,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
  };
}
