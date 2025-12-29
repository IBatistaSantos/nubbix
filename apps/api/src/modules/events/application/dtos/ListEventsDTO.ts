import { z } from "zod";
import { EventTypeValue } from "../../domain/vo/EventType";
import { TicketSalesStatusValue } from "../../domain/vo/TicketSales";

export interface ListEventsQuery {
  accountId: string;
  tags?: string[];
  type?: EventTypeValue;
  ticketSalesEnabled?: boolean;
  ticketSalesStatus?: TicketSalesStatusValue;
  page?: number;
  limit?: number;
}

export interface ListEventsOutput {
  events: Array<{
    id: string;
    accountId: string;
    name: string;
    description: string;
    type: string;
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
      status: string;
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
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const listEventsQuerySchema = z.object({
  accountId: z.string().uuid("Invalid account ID format"),
  tags: z.array(z.string()).optional(),
  type: z.enum(["digital", "hybrid", "in-person"]).optional(),
  ticketSalesEnabled: z.coerce.boolean().optional(),
  ticketSalesStatus: z.enum(["open", "closed"]).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});
