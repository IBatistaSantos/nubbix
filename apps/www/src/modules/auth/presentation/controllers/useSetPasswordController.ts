"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "../mutations/authMutations";

import { useSetPasswordMutation } from "../mutations/authMutations";
import { setPasswordSchema, type SetPasswordInput } from "../../application/dtos/SetPasswordDTO";
import { useEffect } from "react";

export function useSetPasswordController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setPasswordMutation = useSetPasswordMutation();
  const loginMutation = useLoginMutation();
  const tokenParam = searchParams.get("token");
  const token = tokenParam || null;

  const form = useForm<SetPasswordInput>({
    // @ts-expect-error - Zod schema type inference
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
      const setPasswordResult = await setPasswordMutation.mutateAsync({
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const accountSlug = window.location.pathname.match(/^\/accounts\/([a-zA-Z0-9_-]+)/)?.[1];
      if (!accountSlug) {
        throw new Error("Account slug não encontrado");
      }

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
