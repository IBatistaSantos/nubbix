import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "auth-token";

const PUBLIC_ROUTES = ["/"];

const API_ROUTES = ["/api"];

const PUBLIC_ACCOUNT_ROUTES = ["/login", "/forgot-password", "/reset-password", "/onboarding"];

const PROTECTED_ROUTES = ["/dashboard", "/events"];

function getAccountSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/accounts\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function isValidAccountSlug(slug: string | null): boolean {
  if (!slug || slug.trim().length === 0) {
    return false;
  }
  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  return slugRegex.test(slug);
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}

function isApiRoute(pathname: string): boolean {
  return API_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicAccountRoute(pathname: string): boolean {
  return PUBLIC_ACCOUNT_ROUTES.some((route) => pathname.includes(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAccountRoute(pathname: string): boolean {
  return pathname.startsWith("/accounts/");
}

function getAuthToken(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_NAME)?.value;
}

function redirectToLogin(
  request: NextRequest,
  accountSlug: string,
  redirectPath: string
): NextResponse {
  const loginUrl = new URL(`/accounts/${accountSlug}/login`, request.url);
  loginUrl.searchParams.set("redirect", redirectPath);
  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (isApiRoute(pathname)) {
    return NextResponse.next();
  }

  const accountSlug = getAccountSlugFromPathname(pathname);
  if (accountSlug && !isValidAccountSlug(accountSlug)) {
    return NextResponse.json({ message: "Invalid account slug format" }, { status: 400 });
  }

  if (isAccountRoute(pathname)) {
    if (isPublicAccountRoute(pathname)) {
      return NextResponse.next();
    }

    const authToken = getAuthToken(request);
    if (!authToken) {
      return redirectToLogin(request, accountSlug!, pathname);
    }

    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    const authToken = getAuthToken(request);
    if (!authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
