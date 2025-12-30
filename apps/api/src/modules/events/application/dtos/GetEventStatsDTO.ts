import { z } from "zod";

export interface GetEventStatsQuery {
  accountId: string;
}

export interface GetEventStatsOutput {
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

export const getEventStatsQuerySchema = z.object({
  accountId: z.string().uuid("Invalid account ID format"),
});
