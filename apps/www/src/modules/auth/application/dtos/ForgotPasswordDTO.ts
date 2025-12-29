import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordOutput {
  message: string;
}
