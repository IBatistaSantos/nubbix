import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  accountSlug: z
    .string()
    .min(1, "Account slug is required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Account slug can only contain letters, numbers, hyphens and underscores"
    ),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordOutput {
  message: string;
}
