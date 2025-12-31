"use client";

import { useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginSchema, type LoginInput, type LoginOutput } from "../../application/dtos";
import { getAuthErrorMessage } from "../utils/authErrorUtils";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { LoginUseCase } from "../../application/useCases";
import { AUTH_QUERY_KEY } from "../queries/authQueries";

export function useLoginController(accountSlug: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const httpClient = useHttpClient();
  const loginUseCase = useMemo(() => new LoginUseCase(httpClient), [httpClient]);

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput): Promise<LoginOutput> => {
      return loginUseCase.run(input, accountSlug);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const form = useForm<LoginInput>({
    // @ts-expect-error - Zod v4 type inference issue with @hookform/resolvers
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(
    useCallback(
      async (data) => {
        try {
          await loginMutation.mutateAsync(data);
          const redirectTo = searchParams.get("redirect") || "/dashboard";
          router.push(redirectTo);
        } catch (error) {
          console.error("Login error:", error);
        }
      },
      [loginMutation, searchParams, router]
    )
  );

  const errorMessage = useMemo(
    () => getAuthErrorMessage(loginMutation.error),
    [loginMutation.error]
  );

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    errorMessage,
  };
}
