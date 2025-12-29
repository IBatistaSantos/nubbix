import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ message: "Token é obrigatório" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // Decodificar JWT para obter expiração (se disponível)
    // Por enquanto, usar MAX_AGE fixo
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction, // true apenas em produção (HTTPS)
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Erro ao definir token" }, { status: 500 });
  }
}
