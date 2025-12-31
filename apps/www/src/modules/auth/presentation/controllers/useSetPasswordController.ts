"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setPasswordSchema,
  type SetPasswordInput,
  type SetPasswordOutput,
} from "../../application/dtos/SetPasswordDTO";
import { type LoginInput, type LoginOutput } from "../../application/dtos";
import { useEffect, useMemo } from "react";
import { useHttpClient } from "../../../../shared/http/useHttpClient";
import { SetPasswordUseCase, LoginUseCase } from "../../application/useCases";
import { AUTH_QUERY_KEY } from "../queries/authQueries";

export function useSetPasswordController(accountSlug: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const tokenParam = searchParams.get("token");
  const token = tokenParam || null;

  const httpClient = useHttpClient();
  const setPasswordUseCase = useMemo(() => new SetPasswordUseCase(httpClient), [httpClient]);
  const loginUseCase = useMemo(() => new LoginUseCase(httpClient), [httpClient]);

  const setPasswordMutation = useMutation({
    mutationFn: (input: SetPasswordInput): Promise<SetPasswordOutput> => {
      return setPasswordUseCase.run(input);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput): Promise<LoginOutput> => {
      return loginUseCase.run(input, accountSlug);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  const form = useForm<SetPasswordInput>({
    // @ts-expect-error - Zod v4 type inference issue with @hookform/resolvers
    resolver: zodResolver(setPasswordSchema),
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
      const setPasswordResult = await setPasswordMutation.mutateAsync(data);

      await loginMutation.mutateAsync({
        email: setPasswordResult.email,
        password: data.password,
      });

      router.push(`/accounts/${accountSlug}`);
    } catch (error) {
      console.error("Set password error:", error);
    }
  });

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isLoading: setPasswordMutation.isPending || loginMutation.isPending,
    error: setPasswordMutation.error || loginMutation.error,
    hasToken: !!token,
    watch: form.watch,
  };
}
