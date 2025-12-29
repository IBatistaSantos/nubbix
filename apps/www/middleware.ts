import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth-token";
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password", "/api/auth"];

/**
 * Extrai o accountSlug do hostname/subdomínio
 */
function getAccountSlugFromRequest(request: NextRequest): string | null {
  const hostname = request.headers.get("host") || "";

  // Se for localhost, extrair o subdomínio antes do "localhost"
  if (hostname.includes("localhost")) {
    const parts = hostname.split(".");
    // Se tiver mais de uma parte antes de localhost, o primeiro é o slug
    // Ex: account-slug.localhost:3000 -> ['account-slug', 'localhost:3000']
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0];
    }
    return null;
  }

  // Para produção (Vercel ou outros domínios)
  // Extrair o primeiro subdomínio
  const parts = hostname.split(".");

  // Se tiver pelo menos 3 partes (ex: account-slug.vercel.app)
  // ou 2 partes onde a primeira não é um TLD conhecido
  if (parts.length >= 2) {
    // Verificar se não é um TLD conhecido (com, org, net, etc)
    const commonTlds = ["com", "org", "net", "io", "app", "dev", "co"];
    const firstPart = parts[0];

    // Se a primeira parte não for um TLD conhecido e não for 'www', é o slug
    if (firstPart && firstPart !== "www" && !commonTlds.includes(firstPart.toLowerCase())) {
      return firstPart;
    }
  }

  return null;
}

/**
 * Valida se o accountSlug tem o formato correto
 */
function isValidAccountSlug(slug: string | null): boolean {
  if (!slug || slug.trim().length === 0) {
    return false;
  }

  // Validar formato: apenas letras, números, hífen e underscore
  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  return slugRegex.test(slug);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extrair accountSlug do subdomínio
  const accountSlug = getAccountSlugFromRequest(request);

  // Validar accountSlug se presente (mas não bloquear se não estiver, para permitir desenvolvimento)
  if (accountSlug && !isValidAccountSlug(accountSlug)) {
    return NextResponse.json({ message: "Invalid account slug format" }, { status: 400 });
  }

  // Permitir acesso a rotas públicas e API routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar se há cookie de autenticação
  const authToken = request.cookies.get(COOKIE_NAME);

  // Se não houver token e não for rota pública, redirecionar para login
  if (!authToken && pathname !== "/login") {
    const loginUrl = new URL("/login", request.url);
    // Preservar a URL original para redirecionar após login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
