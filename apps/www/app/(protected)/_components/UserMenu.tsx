"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@nubbix/ui/avatar";
import { Button } from "@nubbix/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nubbix/ui/dropdown-menu";
import { useAuthController } from "@/modules/auth/presentation/controllers/useAuthController";

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthController();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-3 text-right border-l border-slate-200 pl-4">
        <div>
          <p className="text-xs font-medium text-slate-500 leading-tight">Bem-vindo,</p>
          <p className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative group h-auto p-0 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Avatar className="size-10 border-2 border-white shadow-md transition-transform group-hover:scale-105">
                {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-brand-primary to-purple-500 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            <ChevronDown className="hidden sm:block size-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-white border-slate-200 shadow-lg">
          <DropdownMenuLabel className="px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border-2 border-slate-200">
                {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                <AvatarFallback className="bg-gradient-to-br from-brand-primary to-purple-500 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 leading-tight truncate">{user.email}</p>
                {user.role && (
                  <p className="text-xs text-slate-400 leading-tight mt-1">
                    {user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                      ? "Administrador"
                      : "Usuário"}
                  </p>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="px-3 py-2.5 cursor-pointer">
            <User className="mr-3 h-4 w-4 text-slate-600" />
            <span className="text-sm">Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2.5 cursor-pointer">
            <Settings className="mr-3 h-4 w-4 text-slate-600" />
            <span className="text-sm">Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="px-3 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="text-sm font-medium">Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
