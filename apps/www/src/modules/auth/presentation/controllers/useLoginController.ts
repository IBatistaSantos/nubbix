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
      const accountSlug = window.location.pathname.match(/^\/accounts\/([a-zA-Z0-9_-]+)/)?.[1];
      if (accountSlug) {
        const redirectTo = searchParams.get("redirect") || `/accounts/${accountSlug}`;
        router.push(redirectTo);
      } else {
        router.push("/");
      }
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
