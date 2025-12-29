import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // Remover cookie definindo expiração no passado
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expira imediatamente
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Erro ao limpar token" }, { status: 500 });
  }
}
