"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "../mutations/authMutations";
import { loginSchema, type LoginInput } from "../../application/dtos";
import { getAuthErrorMessage } from "../utils/authErrorUtils";

export function useLoginController(accountSlug: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginInput>({
    // @ts-expect-error - Zod schema type inference
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await loginMutation.mutateAsync({ input: data, accountSlug });
      const redirectTo = searchParams.get("redirect") || `/accounts/${accountSlug}`;
      router.push(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
    }
  });

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
