import { z } from "zod";

export interface SetPasswordInput {
  token: string;
  password: string;
}

export interface SetPasswordOutput {
  userId: string;
  email: string;
}

export const setPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password cannot exceed 255 characters"),
});
