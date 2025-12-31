import { useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery, AUTH_QUERY_KEY } from "../queries/authQueries";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { LogoutUseCase } from "../../application/useCases";

export function useAuthController() {
  const { data: user, isLoading, isError } = useAuthQuery();
  const queryClient = useQueryClient();

  const httpClient = useHttpClient();
  const logoutUseCase = useMemo(() => new LogoutUseCase(httpClient), [httpClient]);

  const logoutMutation = useMutation({
    mutationFn: (): Promise<void> => {
      return logoutUseCase.run();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    logout,
    logoutError: logoutMutation.error,
  };
}
