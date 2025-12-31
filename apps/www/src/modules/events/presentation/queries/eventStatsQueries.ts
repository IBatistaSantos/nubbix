import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthQuery } from "../../../auth/presentation/queries/authQueries";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { GetEventStatsUseCase, type EventStats } from "../../application/useCases";

const EVENT_STATS_QUERY_KEY = ["events", "stats"] as const;

export function useEventStatsQuery() {
  const { data: user } = useAuthQuery();
  const httpClient = useHttpClient();
  const getEventStatsUseCase = useMemo(() => new GetEventStatsUseCase(httpClient), [httpClient]);

  return useQuery({
    queryKey: [...EVENT_STATS_QUERY_KEY, user?.accountId],
    queryFn: async (): Promise<EventStats> => {
      if (!user?.accountId) {
        return {
          totalEvents: 0,
          activeEvents: 0,
          eventTypes: 0,
          eventsThisMonth: 0,
          nextEvent: null,
        };
      }

      return getEventStatsUseCase.run();
    },
    enabled: !!user?.accountId,
    staleTime: 30 * 1000, // 30 segundos
  });
}

export type { EventStats } from "../../application/useCases";
