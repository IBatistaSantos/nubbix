import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
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

