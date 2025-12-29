"use client";

import { useSetPasswordController } from "@/modules/auth/presentation/controllers/useSetPasswordController";
import {
  Logo,
  PasswordField,
  ErrorMessage,
  AuthButton,
  AuthHeader,
} from "@/modules/auth/presentation/components";
import { PasswordStrengthField } from "@/modules/auth/presentation/components/PasswordStrengthField";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { useParams } from "next/navigation";

function OnboardingForm() {
  const params = useParams();
  const slug = params.slug as string;
  const { register, handleSubmit, errors, isLoading, error, hasToken, watch } =
    useSetPasswordController(slug);

  const passwordValue = watch("password") || "";

  if (!hasToken) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Logo className="mb-10" />

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Link inválido</h1>
          <p className="text-text-secondary text-sm mb-6">
            O link de onboarding é inválido ou expirou. Entre em contato com o suporte para
            solicitar um novo link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Logo className="mb-10" />

      <AuthHeader title="Bem-vindo!" subtitle="Defina sua senha para começar a usar sua conta." />

      <ErrorMessage
        message={error instanceof Error ? error.message : error ? "Erro ao definir senha" : ""}
      />

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <PasswordStrengthField
          id="password"
          label="Senha"
          error={errors.password?.message}
          register={register("password")}
          autoComplete="new-password"
          showStrengthIndicator={true}
          watchValue={passwordValue}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
          register={register("confirmPassword")}
          autoComplete="new-password"
        />

        <AuthButton isLoading={isLoading}>
          {isLoading ? "Configurando..." : "Definir senha e entrar"}
        </AuthButton>
      </form>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto">
          <Logo className="mb-10" />
          <div className="text-center text-text-secondary">Carregando...</div>
        </div>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}
