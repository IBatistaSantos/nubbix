"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "../mutations/authMutations";
import { resetPasswordSchema, type ResetPasswordInput } from "../../application/dtos";
import { useState, useEffect } from "react";

export function useResetPasswordController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPasswordMutation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
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
        token: data.token,
        password: data.password,
      });
      router.push("/login?reset=success");
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
