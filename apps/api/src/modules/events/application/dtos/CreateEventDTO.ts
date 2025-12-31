import { z } from "zod";
import { EventTypeValue } from "../../domain/vo/EventType";
import { TicketSalesStatusValue } from "../../domain/vo/TicketSales";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");
const timeSchema = z
  .string()
  .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format");

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

const eventDateSchema = z.object({
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

const ticketSalesSchema = z.object({
  enabled: z.boolean(),
  status: z.enum(["open", "closed"]),
});

export interface CreateEventInput {
  accountId: string;
  name: string;
  description: string;
  type: EventTypeValue;
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
    status: TicketSalesStatusValue;
  };
  tags?: string[];
  dates: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface CreateEventOutput {
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

export const createEventSchema = z.object({
  accountId: z.string().uuid("Invalid account ID format"),
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  description: z.string().min(1, "Description is required").nullable().optional(),
  type: z.enum(["digital", "hybrid", "in-person"], {
    errorMap: () => ({ message: "Type must be digital, hybrid, or in-person" }),
  }),
  url: z
    .string()
    .min(1, "URL is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "URL can only contain letters, numbers, hyphens and underscores"),
  address: addressSchema,
  maxCapacity: z
    .number()
    .int("Max capacity must be an integer")
    .positive("Max capacity must be positive")
    .nullable()
    .optional(),
  ticketSales: ticketSalesSchema,
  tags: z
    .array(z.string())
    .max(30, "Tags cannot exceed 30 items")
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "Tags cannot contain duplicates",
    })
    .optional(),
  dates: z
    .array(eventDateSchema)
    .min(1, "At least one date is required")
    .refine(
      (dates) => {
        const keys = new Set<string>();
        for (const date of dates) {
          const key = `${date.date}-${date.startTime}-${date.endTime}`;
          if (keys.has(key)) {
            return false;
          }
          keys.add(key);
        }
        return true;
      },
      {
        message: "Cannot have duplicate date, startTime, and endTime combinations",
      }
    ),
});
