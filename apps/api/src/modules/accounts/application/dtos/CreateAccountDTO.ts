import { z } from "zod";
import { AccountTypeValue } from "../../domain";

export interface CreateAccountInput {
  accountName: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
  accountType: AccountTypeValue;
  responsibleName: string;
  responsibleEmail: string;
}

export interface CreateAccountOutput {
  accountId: string;
  slug: string;
}

export const createAccountSchema = z.object({
  accountName: z
    .string()
    .min(1, "Account name cannot be empty")
    .max(255, "Account name cannot exceed 255 characters"),
  slug: z.string().min(1, "Slug cannot be empty"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  website: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().url("Invalid website URL format").optional())
    .optional(),
  logo: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .pipe(z.string().url("Invalid logo URL format").optional())
    .optional(),
  accountType: z.enum(["TRANSACTIONAL", "RECURRING"], {
    errorMap: () => ({ message: "Account type must be TRANSACTIONAL or RECURRING" }),
  }),
  responsibleName: z
    .string()
    .min(1, "Responsible name cannot be empty")
    .max(255, "Responsible name cannot exceed 255 characters"),
  responsibleEmail: z.string().email("Invalid email format"),
});
