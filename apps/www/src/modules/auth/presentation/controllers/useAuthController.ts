import { useAuthQuery } from "../queries/authQueries";
import {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../mutations/authMutations";
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput } from "../../application/dtos";

export function useAuthController() {
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
      return loginMutation.mutateAsync(input);
    },
    logout: async () => {
      return logoutMutation.mutateAsync();
    },
    forgotPassword: async (input: ForgotPasswordInput) => {
      return forgotPasswordMutation.mutateAsync(input);
    },
    resetPassword: async (input: ResetPasswordInput) => {
      return resetPasswordMutation.mutateAsync(input);
    },
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
  };
}
