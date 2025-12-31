import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/http/apiClient";
import type { Event } from "../queries/eventQueries";

export interface CreateEventInput {
  name: string;
  description?: string;
  type: "digital" | "hybrid" | "in-person";
  url: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip?: string | null;
    country: string;
  } | null;
  maxCapacity?: number | null;
  ticketSales: {
    enabled: boolean;
    status: "open" | "closed";
  };
  tags?: string[];
  dates: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

export type CreateEventOutput = Event;

const EVENTS_QUERY_KEY = ["events"] as const;

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEventInput): Promise<CreateEventOutput> => {
      const ticketSales = input.ticketSales.enabled
        ? { enabled: true, status: "open" as const }
        : { enabled: false, status: "closed" as const };

      const payload = {
        ...input,
        ticketSales,
      };

      return apiClient<CreateEventOutput>("/events", {
        method: "POST",
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });
}
