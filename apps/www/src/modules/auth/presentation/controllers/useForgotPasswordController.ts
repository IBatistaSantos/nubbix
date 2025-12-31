"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
  type ForgotPasswordOutput,
} from "../../application/dtos";
import { useState, useMemo, useCallback } from "react";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { ForgotPasswordUseCase } from "../../application/useCases";

export function useForgotPasswordController(accountSlug: string) {
  const [isSuccess, setIsSuccess] = useState(false);

  const httpClient = useHttpClient();
  const forgotPasswordUseCase = useMemo(() => new ForgotPasswordUseCase(httpClient), [httpClient]);

  const forgotPasswordMutation = useMutation({
    mutationFn: (input: ForgotPasswordInput): Promise<ForgotPasswordOutput> => {
      return forgotPasswordUseCase.run(input, accountSlug);
    },
  });

  const form = useForm<ForgotPasswordInput>({
    // @ts-expect-error - Zod v4 type inference issue with @hookform/resolvers
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(
    useCallback(
      async (data) => {
        try {
          await forgotPasswordMutation.mutateAsync(data);
          setIsSuccess(true);
        } catch (error) {
          console.error("Forgot password error:", error);
        }
      },
      [forgotPasswordMutation]
    )
  );

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isLoading: forgotPasswordMutation.isPending,
    error: forgotPasswordMutation.error,
    isSuccess,
  };
}
