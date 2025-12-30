"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useLoginController } from "@/modules/auth/presentation/controllers/useLoginController";
import { Logo } from "../../../_components/Logo";
import { AuthHeader } from "../../../_components/AuthHeader";
import { ErrorMessage } from "../../../_components/ErrorMessage";
import { AuthButton } from "../../../_components/AuthButton";
import { EmailField } from "../_components/EmailField";
import { PasswordField } from "../_components/PasswordField";
import { AuthLink } from "../_components/AuthLink";

function LoginForm() {
  const params = useParams();
  const slug = params.slug as string;

  const { register, handleSubmit, errors, isLoading, errorMessage } = useLoginController(slug);

  return (
    <div className="w-full max-w-md mx-auto">
      <Logo className="mb-8 sm:mb-12 md:mb-16" />

      <AuthHeader
        title="Bem-vindo de volta"
        subtitle="Entre para gerenciar seus eventos e experiências"
      />

      <ErrorMessage message={errorMessage || ""} />

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
        <EmailField
          id="email"
          label="E-mail"
          error={errors.email?.message}
          register={register("email")}
        />

        <PasswordField
          id="password"
          label="Senha"
          error={errors.password?.message}
          register={register("password")}
        />

        <div className="flex items-center justify-end pt-1">
          <AuthLink href={`/accounts/${slug}/forgot-password`}>Esqueceu a senha?</AuthLink>
        </div>

        <AuthButton isLoading={isLoading} className="mt-2">
          {isLoading ? "Entrando..." : "Entrar"}
        </AuthButton>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto">
          <Logo className="mb-10" />
          <div className="text-center text-text-secondary">Carregando...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
