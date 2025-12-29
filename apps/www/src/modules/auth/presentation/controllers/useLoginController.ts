"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "../mutations/authMutations";
import { loginSchema, type LoginInput } from "../../application/dtos";

export function useLoginController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const form = useForm<LoginInput>({
    // @ts-expect-error - Zod schema type inference
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
    }
  });

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
