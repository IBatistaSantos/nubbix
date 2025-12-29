import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountSlug: z
    .string()
    .min(1, "Account slug is required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Account slug can only contain letters, numbers, hyphens and underscores"
    ),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordOutput {
  userId: string;
  email: string;
}
