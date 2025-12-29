"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "../mutations/authMutations";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../../application/dtos";
import { useState } from "react";

export function useForgotPasswordController() {
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPasswordMutation = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordInput>({
    // @ts-expect-error - Zod schema type inference
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  });

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isLoading: forgotPasswordMutation.isPending,
    error: forgotPasswordMutation.error,
    isSuccess,
  };
}
