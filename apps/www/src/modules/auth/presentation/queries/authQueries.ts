import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { User } from "../../domain/types/AuthTypes";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { GetUserProfileUseCase } from "../../application/useCases";

const AUTH_QUERY_KEY = ["auth"] as const;

export function useAuthQuery() {
  const httpClient = useHttpClient();
  const getUserProfileUseCase = useMemo(() => new GetUserProfileUseCase(httpClient), [httpClient]);

  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async (): Promise<User | null> => {
      return getUserProfileUseCase.run();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: true,
  });
}

export { AUTH_QUERY_KEY };
