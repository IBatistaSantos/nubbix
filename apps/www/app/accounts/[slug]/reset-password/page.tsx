"use client";

import { useResetPasswordController } from "@/modules/auth/presentation/controllers/useResetPasswordController";
import { Logo } from "../../../_components/Logo";
import { AuthHeader } from "../../../_components/AuthHeader";
import { ErrorMessage } from "../../../_components/ErrorMessage";
import { AuthButton } from "../../../_components/AuthButton";
import { PasswordField } from "../_components/PasswordField";
import { PasswordStrengthField } from "../_components/PasswordStrengthField";
import { AuthLink } from "../_components/AuthLink";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

function ResetPasswordForm() {
  const params = useParams();
  const slug = params.slug as string;
  const { register, handleSubmit, errors, isLoading, error, hasToken, watch } =
    useResetPasswordController(slug);

  const passwordValue = watch("password") || "";

  if (!hasToken) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Logo className="mb-10" />

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Token inválido</h1>
          <p className="text-text-secondary text-sm mb-6">
            O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link.
          </p>
          <Link href={`/accounts/${slug}/forgot-password`}>
            <AuthButton>Solicitar novo link</AuthButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Logo className="mb-10" />

      <AuthHeader title="Redefinir senha" subtitle="Digite sua nova senha abaixo." />

      <ErrorMessage
        message={error instanceof Error ? error.message : error ? "Erro ao redefinir senha" : ""}
      />

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <PasswordStrengthField
          id="password"
          label="Nova senha"
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
          {isLoading ? "Redefinindo..." : "Redefinir senha"}
        </AuthButton>
      </form>

      <div className="mt-6 text-center">
        <AuthLink href={`/accounts/${slug}/login`}>Voltar para o login</AuthLink>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto">
          <Logo className="mb-10" />
          <div className="text-center text-text-secondary">Carregando...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
