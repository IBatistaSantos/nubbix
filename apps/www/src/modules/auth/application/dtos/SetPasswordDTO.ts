import { z } from "zod";

export const setPasswordSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/\d/, "A senha deve conter pelo menos um número")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "A senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

export interface SetPasswordOutput {
  userId: string;
  email: string;
}
