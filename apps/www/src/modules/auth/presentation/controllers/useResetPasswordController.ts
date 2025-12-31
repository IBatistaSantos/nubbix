"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
  type ResetPasswordOutput,
} from "../../application/dtos";
import { useEffect, useMemo } from "react";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { ResetPasswordUseCase } from "../../application/useCases";

export function useResetPasswordController(accountSlug: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const token = tokenParam || null;

  const httpClient = useHttpClient();
  const resetPasswordUseCase = useMemo(() => new ResetPasswordUseCase(httpClient), [httpClient]);

  const resetPasswordMutation = useMutation({
    mutationFn: (input: ResetPasswordInput): Promise<ResetPasswordOutput> => {
      return resetPasswordUseCase.run(input, accountSlug);
    },
  });

  const form = useForm<ResetPasswordInput>({
    // @ts-expect-error - Zod v4 type inference issue with @hookform/resolvers
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
      await resetPasswordMutation.mutateAsync(data);
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
