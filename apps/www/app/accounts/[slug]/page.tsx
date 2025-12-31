"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthController } from "@/modules/auth/presentation/controllers/useAuthController";
import { Button } from "@nubbix/ui/button";

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user, logout, isLoading } = useAuthController();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/accounts/${slug}/login`);
    }
  }, [user, isLoading, router, slug]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push(`/accounts/${slug}/login`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, router, slug]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Olá, {user.name}!</h1>
        <Button
          onClick={handleLogout}
          aria-label="Sair da conta"
          className="bg-brand-primary hover:bg-brand-primary-hover"
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
