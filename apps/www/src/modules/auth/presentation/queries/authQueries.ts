import { useQuery } from "@tanstack/react-query";
import type { User } from "../../domain/types/AuthTypes";
import { apiClient } from "../../../../shared/http/apiClient";

const AUTH_QUERY_KEY = ["auth"] as const;

export function useAuthQuery() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await apiClient<User>("/auth/me", {
          method: "GET",
        });
        return response;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: true,
  });
}

export function useUserQuery() {
  const { data: user, ...rest } = useAuthQuery();
  return { user, ...rest };
}
