import { z } from "zod";
import { isBefore, startOfDay, parseISO } from "date-fns";

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

const addressSchema = z
  .object({
    street: z.string().min(1, "Rua é obrigatória"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    zip: z.string().nullable().optional(),
    country: z.string().min(1, "País é obrigatório"),
  })
  .nullable()
  .optional();

export const createEventFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome do evento é obrigatório")
      .max(255, "Nome não pode exceder 255 caracteres"),
    description: z.string().optional(),
    type: z
      .string()
      .min(1, "Tipo do evento é obrigatório")
      .refine((val) => ["digital", "hybrid", "in-person"].includes(val), {
        message: "Tipo do evento é obrigatório",
      }),
    url: z
      .string()
      .min(1, "URL do evento é obrigatória")
      .regex(/^[a-zA-Z0-9_-]+$/, "Use apenas letras, números, hífen e underscore"),
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
    address: addressSchema,
    maxCapacity: z
      .preprocess(
        (val) => {
          if (
            val === "" ||
            val === null ||
            val === undefined ||
            (typeof val === "number" && isNaN(val))
          ) {
            return undefined;
          }
          return typeof val === "string" ? Number(val) : val;
        },
        z
          .number({
            message: "Capacidade máxima deve ser um número",
          })
          .int("Capacidade máxima deve ser um número inteiro positivo")
          .positive("Capacidade máxima deve ser um número inteiro positivo")
          .optional()
      )
      .optional(),
    ticketSales: z.object({
      enabled: z.boolean(),
    }),
    tags: z
      .array(z.string())
      .max(30, "Máximo de 30 tags permitidas")
      .refine((tags) => new Set(tags).size === tags.length, {
        message: "Tags não podem conter duplicatas",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "hybrid" || data.type === "in-person") {
        if (!data.address) {
          return false;
        }
        return !!(
          data.address.street?.trim() &&
          data.address.city?.trim() &&
          data.address.state?.trim() &&
          data.address.country?.trim()
        );
      }
      return true;
    },
    {
      message: "Endereço é obrigatório para eventos híbridos e presenciais",
      path: ["address"],
    }
  );

export type CreateEventFormInput = z.infer<typeof createEventFormSchema>;

export type EventDateForm = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
};
