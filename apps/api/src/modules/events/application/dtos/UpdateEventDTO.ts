import { z } from "zod";
import { EventTypeValue } from "../../domain/vo/EventType";
import { TicketSalesStatusValue } from "../../domain/vo/TicketSales";

const addressSchema = z
  .object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().nullable().optional(),
    country: z.string().min(1, "Country is required"),
  })
  .nullable()
  .optional();

const ticketSalesSchema = z.object({
  enabled: z.boolean(),
  status: z.enum(["open", "closed"]),
});

export interface UpdateEventInput {
  eventId: string;
  name?: string;
  description?: string;
  type?: EventTypeValue;
  address?: {
    street: string;
    city: string;
    state: string;
    zip?: string | null;
    country: string;
  } | null;
  maxCapacity?: number | null;
  ticketSales?: {
    enabled: boolean;
    status: TicketSalesStatusValue;
  };
  tags?: string[];
}

export interface UpdateEventOutput {
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
}

export const updateEventSchema = z.object({
  eventId: z.string().uuid("Invalid event ID format"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name cannot exceed 255 characters")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  type: z
    .enum(["digital", "hybrid", "in-person"], {
      errorMap: () => ({ message: "Type must be digital, hybrid, or in-person" }),
    })
    .optional(),
  address: addressSchema,
  maxCapacity: z
    .number()
    .int("Max capacity must be an integer")
    .positive("Max capacity must be positive")
    .nullable()
    .optional(),
  ticketSales: ticketSalesSchema.optional(),
  tags: z
    .array(z.string())
    .max(30, "Tags cannot exceed 30 items")
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "Tags cannot contain duplicates",
    })
    .optional(),
});
