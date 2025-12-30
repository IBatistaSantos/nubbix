"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export async function setAuthToken(token: string): Promise<void> {
  if (!token || typeof token !== "string") {
    throw new Error("Token é obrigatório");
  }

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // true apenas em produção (HTTPS)
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value || null;
}
