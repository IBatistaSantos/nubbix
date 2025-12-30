import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../application/services/AuthService";
import type {
  LoginInput,
  LoginOutput,
  ForgotPasswordInput,
  ForgotPasswordOutput,
  ResetPasswordInput,
  ResetPasswordOutput,
} from "../../application/dtos";
import type { SetPasswordInput, SetPasswordOutput } from "../../application/dtos/SetPasswordDTO";

const AUTH_QUERY_KEY = ["auth"] as const;

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      accountSlug,
    }: {
      input: LoginInput;
      accountSlug: string;
    }): Promise<LoginOutput> => {
      return authService.login(input, accountSlug);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<void> => {
      return authService.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: ({
      input,
      accountSlug,
    }: {
      input: ForgotPasswordInput;
      accountSlug: string;
    }): Promise<ForgotPasswordOutput> => {
      return authService.forgotPassword(input, accountSlug);
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({
      input,
      accountSlug,
    }: {
      input: ResetPasswordInput;
      accountSlug: string;
    }): Promise<ResetPasswordOutput> => {
      return authService.resetPassword(input, accountSlug);
    },
  });
}

export function useSetPasswordMutation() {
  return useMutation({
    mutationFn: (input: SetPasswordInput): Promise<SetPasswordOutput> => {
      return authService.setPassword(input);
    },
  });
}
