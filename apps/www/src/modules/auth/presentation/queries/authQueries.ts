import { useQuery } from "@tanstack/react-query";
import type { User } from "../../domain/types/AuthTypes";

const AUTH_QUERY_KEY = ["auth"] as const;

export function useAuthQuery() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async (): Promise<User | null> => {
      try {
        // Endpoint para verificar autenticação atual
        // Por enquanto, retornar null - pode ser implementado quando houver endpoint /auth/me
        // Quando o endpoint estiver disponível, descomentar:
        // const response = await apiClient<{ user: User }>('/auth/me', {
        //   method: 'GET',
        // })
        // return response.user
        return null;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: false, // Desabilitado até que o endpoint /auth/me esteja disponível
  });
}

export function useUserQuery() {
  const { data: user, ...rest } = useAuthQuery();
  return { user, ...rest };
}
