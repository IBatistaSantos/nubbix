"use client";

import { useForgotPasswordController } from "@/modules/auth/presentation/controllers/useForgotPasswordController";
import {
  Logo,
  EmailField,
  ErrorMessage,
  AuthButton,
  AuthLink,
  AuthHeader,
} from "@/modules/auth/presentation/components";
import { Button } from "@nubbix/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { register, handleSubmit, errors, isLoading, error, isSuccess } =
    useForgotPasswordController();

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Logo className="mb-10" />

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">E-mail enviado!</h1>
          <p className="text-text-secondary text-sm">
            Verifique sua caixa de entrada. Enviamos um link para redefinir sua senha.
          </p>
        </div>

        <Link href={`/accounts/${slug}/login`}>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Logo className="mb-10" />

      <AuthHeader
        title="Esqueceu sua senha?"
        subtitle="Digite seu e-mail e enviaremos um link para redefinir sua senha."
      />

      <ErrorMessage
        message={error instanceof Error ? error.message : error ? "Erro ao enviar e-mail" : ""}
      />

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <EmailField
          id="email"
          label="E-mail"
          error={errors.email?.message}
          register={register("email")}
        />

        <AuthButton isLoading={isLoading}>
          {isLoading ? "Enviando..." : "Enviar link de recuperação"}
        </AuthButton>
      </form>

      <div className="mt-6 text-center">
        <AuthLink
          href={`/accounts/${slug}/login`}
          className="flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o login
        </AuthLink>
      </div>
    </div>
  );
}
