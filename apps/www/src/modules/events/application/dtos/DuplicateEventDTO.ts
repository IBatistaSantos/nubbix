import { z } from "zod";
import { isBefore, startOfDay, parseISO } from "date-fns";
import { normalizeUrl } from "../../presentation/utils/eventValidationUtils";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD");

const timeSchema = z
  .string()
  .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Hora deve estar no formato HH:mm");

const eventDateSchema = z.object({
  id: z.string(),
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

export const duplicateEventFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do evento é obrigatório")
    .max(255, "Nome não pode exceder 255 caracteres"),
  url: z
    .string()
    .min(1, "URL do evento é obrigatória")
    .transform((val) => normalizeUrl(val))
    .pipe(z.string().regex(/^[a-zA-Z0-9_-]+$/, "Use apenas letras, números, hífen e underscore")),
  dates: z
    .array(eventDateSchema)
    .min(1, "Adicione pelo menos uma data")
    .refine(
      (dates) => {
        return dates.every((d) => d.date && d.startTime && d.endTime);
      },
      {
        message: "Preencha todas as datas adicionadas (data, hora inicial e final)",
      }
    )
    .refine(
      (dates) => {
        const today = startOfDay(new Date());
        return dates.every((d) => {
          if (!d.date) return true;
          const selectedDate = startOfDay(parseISO(d.date));
          return !isBefore(selectedDate, today);
        });
      },
      {
        message: "Datas não podem ser anteriores ao dia atual",
      }
    )
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
        message: "Não pode ter combinações duplicadas de data, hora inicial e final",
      }
    ),
});

export type DuplicateEventFormInput = z.infer<typeof duplicateEventFormSchema>;

export type EventDateForm = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
};

const duplicateEventInputDateSchema = z.object({
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

export const duplicateEventInputSchema = z.object({
  eventId: z.string().uuid("Invalid event ID format"),
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  url: z
    .string()
    .min(1, "URL is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "URL can only contain letters, numbers, hyphens and underscores"),
  dates: z
    .array(duplicateEventInputDateSchema)
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

export interface DuplicateEventInput {
  eventId: string;
  name: string;
  url: string;
  dates: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface DuplicateEventOutput {
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
