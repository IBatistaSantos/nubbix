import { z } from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");
const timeSchema = z
  .string()
  .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format");

const eventDateSchema = z.object({
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

export interface UpdateEventDatesInput {
  eventId: string;
  add?: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  update?: Array<{
    dateId: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  }>;
  remove?: string[];
}

export interface UpdateEventDatesOutput {
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

export const updateEventDatesSchema = z.object({
  eventId: z.string().uuid("Invalid event ID format"),
  add: z
    .array(eventDateSchema)
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
    )
    .optional(),
  update: z
    .array(
      z.object({
        dateId: z.string().uuid("Invalid date ID format"),
        date: dateSchema.optional(),
        startTime: timeSchema.optional(),
        endTime: timeSchema.optional(),
      })
    )
    .optional(),
  remove: z.array(z.string().uuid("Invalid date ID format")).optional(),
});
