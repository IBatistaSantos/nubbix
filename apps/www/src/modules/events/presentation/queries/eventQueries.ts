import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthQuery } from "../../../auth/presentation/queries/authQueries";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { ListEventsUseCase } from "../../application/useCases";

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

export type { ListEventsResponse } from "../../application/useCases";

const EVENTS_QUERY_KEY = ["events"] as const;

export function useEventsQuery() {
  const { data: user } = useAuthQuery();
  const httpClient = useHttpClient();
  const listEventsUseCase = useMemo(() => new ListEventsUseCase(httpClient), [httpClient]);

  return useQuery({
    queryKey: [...EVENTS_QUERY_KEY, user?.accountId],
    queryFn: async (): Promise<Event[]> => {
      if (!user?.accountId) {
        return [];
      }

      return listEventsUseCase.run();
    },
    enabled: !!user?.accountId,
    staleTime: 30 * 1000, // 30 segundos
  });
}
