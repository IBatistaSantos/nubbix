import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/http/apiClient";
import { useAuthQuery } from "../../../auth/presentation/queries/authQueries";

export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  eventTypes: number;
  eventsThisMonth: number;
  nextEvent: {
    id: string;
    name: string;
    date: string;
    daysUntil: number;
  } | null;
}

const EVENT_STATS_QUERY_KEY = ["events", "stats"] as const;

export function useEventStatsQuery() {
  const { data: user } = useAuthQuery();

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

      const response = await apiClient<EventStats>("/events/stats", {
        method: "GET",
      });

      return response;
    },
    enabled: !!user?.accountId,
    staleTime: 30 * 1000, // 30 segundos
  });
}
