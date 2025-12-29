"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "../mutations/authMutations";
import { resetPasswordSchema, type ResetPasswordInput } from "../../application/dtos";
import { useEffect } from "react";

export function useResetPasswordController(accountSlug: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPasswordMutation();
  const tokenParam = searchParams.get("token");
  const token = tokenParam || null;

  const form = useForm<ResetPasswordInput>({
    // @ts-expect-error - Zod schema type inference
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!token) {
      form.setError("token", { message: "Token não encontrado" });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        input: {
          token: data.token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
        accountSlug,
      });
      router.push(`/accounts/${accountSlug}/login?reset=success`);
    } catch (error) {
      console.error("Reset password error:", error);
    }
  });

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isLoading: resetPasswordMutation.isPending,
    error: resetPasswordMutation.error,
    hasToken: !!token,
    watch: form.watch,
  };
}
