import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  accountSlug: z
    .string()
    .min(1, "Account slug is required")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Account slug can only contain letters, numbers, hyphens and underscores"
    ),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface LoginOutput {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    accountId: string;
    role: string;
    avatar: string | null;
  };
}
