"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/shared/http/apiClient";
import { Logo, AuthHeader, AuthButton, ErrorMessage } from "@/modules/auth/presentation/components";
import { AuthPromoPanel } from "@/modules/auth/presentation/components/AuthPromoPanel";

type ValidateSlugResponse =
  | {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      website: string | null;
      logo: string | null;
      accountType: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    }
  | null;

export default function Home() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient<ValidateSlugResponse>(
        `/accounts/validate-slug?slug=${encodeURIComponent(slug.trim())}`
      );

      if (response && response.slug) {
        router.push(`/accounts/${response.slug}/login`);
      } else {
        setError("Conta não encontrada. Verifique o slug e tente novamente.");
      }
    } catch (err) {
      setError("Erro ao validar conta. Tente novamente.");
      console.error("Validation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="w-full lg:w-[45%] flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-16 xl:p-24 bg-white relative z-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md mx-auto">
          <Logo className="mb-8 sm:mb-12 md:mb-16" />

          <AuthHeader
            title="Acesse sua conta"
            subtitle="Digite o slug da sua conta para continuar"
          />

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-text-label mb-2">
                URL da conta
              </label>
              <div className="flex gap-0">
                <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-border bg-gray-50 text-text-muted text-sm h-11 sm:h-12">
                  https://
                </span>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="nome-da-conta"
                  className="flex-1 px-4 py-2 h-11 sm:h-12 border border-border rounded-r-md focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent text-base sm:text-sm text-text-primary placeholder:text-text-muted"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <p className="mt-2 text-sm text-text-muted">
                Digite o slug da sua conta (ex: minha-empresa)
              </p>
            </div>

            <AuthButton isLoading={isLoading} disabled={!slug.trim()}>
              {isLoading ? "Verificando..." : "Continuar"}
            </AuthButton>
          </form>
        </div>
      </div>
      <AuthPromoPanel />
    </div>
  );
}

