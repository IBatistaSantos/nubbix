"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../../_components/Logo";
import { UserMenu } from "./UserMenu";
import { cn } from "@nubbix/ui/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Eventos", href: "/events" },
];

export function ProtectedHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size={32} showText={true} />

        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  isActive
                    ? "text-brand-primary bg-brand-primary/10 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}
