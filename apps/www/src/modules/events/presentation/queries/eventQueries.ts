import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/http/apiClient";
import { useAuthQuery } from "../../../auth/presentation/queries/authQueries";

export interface Event {
  id: string;
  accountId: string;
  name: string;
  description: string;
  type: "digital" | "hybrid" | "in-person";
  url: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string | null;
    country: string;
  } | null;
  maxCapacity: number | null;
  ticketSales: {
    enabled: boolean;
    status: "open" | "closed";
  };
  tags: string[];
  dates: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    finished: boolean;
    finishedAt: string | null;
  }>;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface ListEventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const EVENTS_QUERY_KEY = ["events"] as const;

export function useEventsQuery() {
  const { data: user } = useAuthQuery();

  return useQuery({
    queryKey: [...EVENTS_QUERY_KEY, user?.accountId],
    queryFn: async (): Promise<Event[]> => {
      if (!user?.accountId) {
        return [];
      }

      const response = await apiClient<ListEventsResponse>("/events", {
        method: "GET",
      });

      return response.events;
    },
    enabled: !!user?.accountId,
    staleTime: 30 * 1000, // 30 segundos
  });
}
