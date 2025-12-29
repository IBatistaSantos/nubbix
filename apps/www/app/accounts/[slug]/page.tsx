"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthController } from "@/modules/auth/presentation/controllers/useAuthController";

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

  const handleLogout = async () => {
    try {
      await logout();
      router.push(`/accounts/${slug}/login`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Hello, {user.name}!</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

