"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthController } from "@/modules/auth/presentation/controllers/useAuthController";
import { ProtectedHeader } from "./_components/ProtectedHeader";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthController();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="min-h-screen flex flex-col bg-background-light">
      <ProtectedHeader />
      <main className="flex-grow pt-16">{children}</main>
    </div>
  );
}
