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

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || loginMutation.isPending,
    isError,
    login: async (input: LoginInput) => {
      if (!accountSlug) {
        throw new Error("Account slug is required for login");
      }
      return loginMutation.mutateAsync({ input, accountSlug });
    },
    logout: async () => {
      return logoutMutation.mutateAsync();
    },
    forgotPassword: async (input: ForgotPasswordInput) => {
      if (!accountSlug) {
        throw new Error("Account slug is required for forgot password");
      }
      return forgotPasswordMutation.mutateAsync({ input, accountSlug });
    },
    resetPassword: async (input: ResetPasswordInput) => {
      if (!accountSlug) {
        throw new Error("Account slug is required for reset password");
      }
      return resetPasswordMutation.mutateAsync({ input, accountSlug });
    },
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
  };
}
